// Note: In next-auth beta, the server-side session access has changed
// For server components, directly use the auth() function from your route handlers
// or server components. This file is kept as a placeholder for reference.

import { auth } from "@/auth";

export async function getCurrentUser() {
  try {
    const session = await auth();
    return session?.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
} 