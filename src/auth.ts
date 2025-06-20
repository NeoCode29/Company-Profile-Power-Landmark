import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// This file is used in all contexts EXCEPT middleware
// It includes the adapter and all Node.js-specific functionality

// Create a new config with our adapter
const config = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
}

// Override the default handler
export const { auth, handlers, signIn, signOut } = NextAuth(config) 