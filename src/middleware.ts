import { getAuthTokenPayload } from 'lib/utils/jwt'
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

    const cookie = request.cookies.get("auth_token")
    const authToken = cookie?.value

    const protectedRoutes = ["/categories"]
    const authRoutes = ["/login", "/signin"]

    if (
        protectedRoutes.includes(request.nextUrl.pathname) &&
        !authToken
    ) {
        request.cookies.delete("auth_token")
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("auth_token")
        return response
    }

    if (authRoutes.includes(request.nextUrl.pathname) && authToken) {
        return NextResponse.redirect(new URL("/categories", request.url))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}