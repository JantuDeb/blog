import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'dev'

// Define a TypeScript interface for the JWT payload if you're using TypeScript
interface JWTPayload {
    email: string
    userId: number
    exp?: number
}

// Utility function to decode JWT token and get email and userId
export function getAuthTokenPayload(request: NextRequest): {
    token?: string
    email?: string
    userId?: number
    expiredAt?: number
} {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
        return { token: undefined, email: undefined, userId: undefined }
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as JWTPayload
        return {
            token,
            email: payload?.email,
            userId: payload?.userId,
            expiredAt: payload.exp,
        }
    } catch (error) {
        console.error('Error verifying auth token:', error)
        return { token: undefined, email: undefined, userId: undefined }
    }
}
