import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const admin = await prisma.adminUser.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })

        if (!admin) return null

        if (admin.lockedUntil && admin.lockedUntil > new Date()) {
          throw new Error('ACCOUNT_LOCKED')
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          admin.passwordHash
        )

        if (!isValid) {
          const failedLogins = admin.failedLogins + 1
          const lockedUntil =
            failedLogins >= 5
              ? new Date(Date.now() + 15 * 60 * 1000)
              : null
          await prisma.adminUser.update({
            where: { id: admin.id },
            data: { failedLogins, lockedUntil },
          })
          return null
        }

        await prisma.adminUser.update({
          where: { id: admin.id },
          data: {
            failedLogins: 0,
            lockedUntil: null,
          },
        })

        return {
          id: admin.id,
          email: admin.email,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? ''
        token.email = user.email ?? ''
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
}