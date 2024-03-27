import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from 'lib/prisma'
import { getAuthTokenPayload } from 'lib/utils/jwt'
import { Status } from 'lib/types/response'
import { cookies } from 'next/headers'
const JWT_SECRET = process.env.JWT_SECRET || 'dev'

export async function signup(request: NextRequest) {
    const { name, email, password } = await request.json()

    if (!name || !email || !password)
        return NextResponse.json(
            { error: 'Email, name and password is required' },
            { status: 400 }
        )

    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: { id: true, name: true, email: true }, // Avoid returning the password
        })

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            {
                expiresIn: '8h',
            }
        )

        const response = new NextResponse(
            JSON.stringify({ data: user, status: Status.Success }),
            {
                status: 200,
            }
        )

        response.cookies.set({
            name: 'auth_token',
            value: token,
            path: '/',
            httpOnly: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: true,
        })

        return response
    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message, status: Status.Failure },
            { status: 500 }
        )
    }
}

export async function login(request: NextRequest) {
    const { email, password } = await request.json()

    if (!email || !password)
        return NextResponse.json(
            { message: 'Email and password is required' },
            { status: 400 }
        )

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user || !(await bcrypt.compare(password, user.password)))
            return NextResponse.json(
                { message: 'Email or password is incorrect' },
                { status: 401 }
            )

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            {
                expiresIn: '8h',
            }
        )

        const isVerified = user.email_verified
        const response = new NextResponse(
            JSON.stringify({
                data: {
                    ...user,
                    password: undefined,
                    status_code: isVerified ? 200 : 403,
                },
                status: isVerified ? Status.Success : Status.OtpPending,
            })
        )
        response.cookies.set({
            name: 'auth_token',
            value: token,
            path: '/',
            httpOnly: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: true,
        })

        return response
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: error?.message, status: Status.Failure }),
            {
                status: 500,
            }
        )
    }
}

export async function verifyEmail(request: NextRequest) {
    const { code } = await request.json()
    const hardcodedVerificationCode = '12345678'

    if (code !== hardcodedVerificationCode) {
        return NextResponse.json(
            { message: 'Verification code is incorrect' },
            { status: 400 }
        )
    }

    const { email, userId } = getAuthTokenPayload(request)

    if (!email || !userId) {
        return NextResponse.json(
            {
                message: 'Unauthorized access. Please log in.',
                status: Status.Failure,
            },
            { status: 401 }
        )
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!existingUser) {
            return NextResponse.json(
                { message: 'User does not exist', status: Status.Failure },
                { status: 404 }
            )
        }

        if (existingUser.email_verified) {
            return NextResponse.json(
                {
                    message: 'Email is already verified',
                    status: Status.Failure,
                },
                { status: 400 }
            )
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                email_verified: true,
            },
        })

        return NextResponse.json(
            { message: 'Email successfully verified', status: Status.Success },
            { status: 200 }
        )
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message, status: Status.Failure },
            { status: 500 }
        )
    }
}

export function logout(request: NextRequest) {
    let response = new NextResponse(
        JSON.stringify({
            message: 'Logout successfully',
            status: Status.Success,
        }),
        { status: 200 }
    )
    response.cookies.delete('auth_token')
    return response
}

export async function getAuthenticatedUser(request: NextRequest) {
    try {
        const { email } = getAuthTokenPayload(request)
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, email: true, email_verified: true },
        })

        if (!user)
            return NextResponse.json(
                {
                    message: 'User not found',
                    status: Status.Failure,
                    status_code: 404,
                },
                { status: 404 }
            )
        return NextResponse.json(
            { data: user, status: Status.Success },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to retrieve user', status: Status.Failure },
            { status: 500 }
        )
    }
}
