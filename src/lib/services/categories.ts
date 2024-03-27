import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma'
import { Status } from 'lib/types/response'
import { getAuthTokenPayload } from 'lib/utils/jwt'
import { IUserCategory } from 'lib/types'

export async function getAllCategories(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const { email } = getAuthTokenPayload(request)

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user)
            return NextResponse.json(
                {
                    message: 'Not authenticated',
                    status: Status.Failure,
                    status_code: 401,
                },
                { status: 401 }
            )
        if (user && !user.email_verified)
            return NextResponse.json(
                {
                    message: 'Not authorised',
                    status: Status.OtpPending,
                    status_code: 403,
                },
                { status: 403 }
            )

        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
        })
        return NextResponse.json(
            { data: categories, status: Status.Success },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to load categories', status: Status.Failure },
            { status: 500 }
        )
    }
}

export async function getUserCategories(request: NextRequest) {
    try {
        const { email, userId } = getAuthTokenPayload(request)
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user)
            return NextResponse.json(
                {
                    message: 'Not authenticated',
                    status: Status.Failure,
                    status_code: 401,
                },
                { status: 401 }
            )
        if (user && !user.email_verified)
            return NextResponse.json(
                {
                    message: 'Not authorised',
                    status: Status.OtpPending,
                    status_code: 403,
                },
                { status: 403 }
            )

        const categories = await prisma.userCategory.findMany({
            where: { userId },
        })
        return NextResponse.json(
            { data: categories, status: Status.Success },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to load categories', status: Status.Failure },
            { status: 500 }
        )
    }
}

export async function updateUserCategories(request: NextRequest) {
    try {
        const { email } = getAuthTokenPayload(request)
        const { categoryId } = await request.json()

        const user = await prisma.user.findUnique({
            where: { email },
            include: { user_categories: true },
        })

        if (!user)
            return NextResponse.json(
                {
                    message: 'Not authenticated',
                    status: Status.Failure,
                    status_code: 401,
                },
                { status: 401 }
            )
        if (!user.email_verified)
            return NextResponse.json(
                {
                    message: 'Not authorised',
                    status: Status.OtpPending,
                    status_code: 403,
                },
                { status: 403 }
            )

        const categoryExists = user.user_categories?.some(
            (uc: IUserCategory) => uc.categoryId === categoryId
        )

        if (categoryExists) {
            // Category exists, so remove it
            await prisma.userCategory.deleteMany({
                where: { userId: user.id, categoryId },
            })
        } else {
            // Category does not exist, so add it
            await prisma.userCategory.create({
                data: { userId: user.id, categoryId },
            })
        }

        return NextResponse.json(
            {
                message: 'User category updated successfully',
                status: Status.Success,
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Failed to update user categories',
                status: Status.Failure,
            },
            { status: 500 }
        )
    }
}
