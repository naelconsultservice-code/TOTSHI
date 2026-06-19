import { prisma } from '@/lib/prisma'
import { computeCompletenessScore } from '@/lib/score'
import type { SubmissionInput } from '@/validations/submission.schema'
import type { Language, ProjectType, NeedType, SubmissionStatus } from '@prisma/client'

export async function createSubmission(
  data: SubmissionInput,
  ipAddress?: string
) {
  const recentSubmission = await prisma.submission.findFirst({
    where: {
      prospect: { email: data.email },
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  })

  const prospect = await prisma.prospect.upsert({
    where: { email: data.email },
    update: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone ?? null,
      company: data.company ?? null,
      country: data.country,
      sector: data.sector,
      language: data.language as Language,
    },
    create: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      company: data.company ?? null,
      country: data.country,
      sector: data.sector,
      language: data.language as Language,
    },
  })

  const isHoneypot = !!data._hp

  const normalizedConstraints = {
    budget: data.constraints?.budget ?? '',
    timeline: data.constraints?.timeline ?? '',
    currentSystem: data.constraints?.currentSystem ?? '',
    technicalConstraints: data.constraints?.technicalConstraints ?? '',
    references: data.constraints?.references ?? '',
    urgencyLevel: data.constraints?.urgencyLevel ?? 'normal',
  }

  const completenessScore = computeCompletenessScore({
    description: data.description,
    targetUsers: {
      profile: data.targetUsers.profile,
      estimatedVolume: data.targetUsers.estimatedVolume ?? '',
      geography: data.targetUsers.geography ?? '',
      techLevel: data.targetUsers.techLevel ?? '',
      accessType: data.targetUsers.accessType ?? '',
    },
    features: data.features ?? { selected: [], freeText: '' },
    constraints: normalizedConstraints,
  })

  const submission = await prisma.submission.create({
    data: {
      prospectId: prospect.id,
      needType: data.needType as NeedType,
      projectType: data.projectType as ProjectType,
      description: data.description,
      targetUsers: data.targetUsers,
      features: data.features ?? { selected: [], freeText: '' },
      constraints: normalizedConstraints,
      language: data.language as Language,
      gdprConsent: data.gdprConsent,
      gdprConsentAt: new Date(),
      completenessScore,
      honeypot: isHoneypot ? data._hp : null,
    },
  })

  await prisma.statusHistory.create({
    data: {
      submissionId: submission.id,
      fromStatus: null,
      toStatus: 'NOUVEAU',
      changedBy: 'system',
    },
  })

  return {
    submission,
    prospect,
    isDuplicate: !!recentSubmission,
    isHoneypot,
  }
}

export async function updateSubmissionStatus(
  submissionId: string,
  newStatus: SubmissionStatus
) {
  const current = await prisma.submission.findUniqueOrThrow({
    where: { id: submissionId },
    select: { status: true },
  })

  const [updated] = await prisma.$transaction([
    prisma.submission.update({
      where: { id: submissionId },
      data: { status: newStatus },
    }),
    prisma.statusHistory.create({
      data: {
        submissionId,
        fromStatus: current.status,
        toStatus: newStatus,
        changedBy: 'admin',
      },
    }),
  ])

  return updated
}

export async function addInternalNote(
  submissionId: string,
  content: string,
  author: string = 'admin'
) {
  return prisma.internalNote.create({
    data: { submissionId, content, author },
  })
}

export async function getSubmissions(params: {
  status?: string
  page?: number
  limit?: number
}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit
  const where = params.status ? { status: params.status as SubmissionStatus } : {}

  const [submissions, total] = await prisma.$transaction([
    prisma.submission.findMany({
      where,
      include: {
        prospect: true,
        documents: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.submission.count({ where }),
  ])

  return {
    submissions,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  }
}

export async function getSubmissionDetail(id: string) {
  return prisma.submission.findUniqueOrThrow({
    where: { id },
    include: {
      prospect: true,
      documents: { orderBy: { version: 'desc' } },
      statusHistory: { orderBy: { createdAt: 'asc' } },
      notes: { orderBy: { createdAt: 'desc' } },
    },
  })
}

export async function getDashboardStats() {
  const total = await prisma.submission.count()

  const byStatus = await prisma.submission.groupBy({
    by: ['status'],
    _count: { status: true },
  })

  const last7Days = await prisma.submission.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  })

  const byProjectType = await prisma.submission.groupBy({
    by: ['projectType'],
    _count: { projectType: true },
    orderBy: { _count: { projectType: 'desc' } },
    take: 1,
  })

  return {
    total,
    byStatus,
    last7Days,
    topProjectType: byProjectType[0]?.projectType ?? null,
  }
}