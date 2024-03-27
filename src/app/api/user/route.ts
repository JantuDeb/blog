import { getAuthenticatedUser } from 'lib/services/auth'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    return getAuthenticatedUser(req)
}
