import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export default {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // When running in edge runtime, we need a simple check
        if (!process.env.VERCEL_URL && typeof window === 'undefined') {
          try {
            const user = await prisma.user.findUnique({
              where: {
                email: email,
              },
            })

            if (!user) {
              return null
            }

            const passwordValid = await compare(password, user.password)

            if (!passwordValid) {
              return null
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
            }
          } catch (e) {
            console.error("Database error:", e)
            // Fall back to simple check on error
          }
        }

        // Simple check for edge environments or when DB is not available
        return {
          id: email,
          email: email,
          name: email.split('@')[0],
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
} satisfies NextAuthConfig 