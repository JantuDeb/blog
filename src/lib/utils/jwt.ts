import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "dev"

// Define a TypeScript interface for the JWT payload if you're using TypeScript
interface JWTPayload {
  email: string
  userId: number
}

// Utility function to decode JWT token and get email and userId
export function getAuthTokenPayload(request: NextRequest): {
  token: string | null
  email: string | null
  userId: number | null
} {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return { token: null, email: null, userId: null }
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload
    return { token, email: payload?.email, userId: payload?.userId }
  } catch (error) {
    console.error("Error verifying auth token:", error)
    return { token: null, email: null, userId: null }
  }
}
