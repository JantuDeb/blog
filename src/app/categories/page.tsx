import { Card } from 'components/card'
import { faker } from '@faker-js/faker'
import { Label } from 'components/label'
import { Input } from 'components/input'
import { Checkbox } from 'components/checkbox'
import PaginationCLient from 'components/pagination-client'
import { useState } from 'react'
import { fetchRequest } from 'lib/network'
import Category from './category'
import { ICategory, IUser, IUserCategory } from 'lib/types'
import { Status } from 'lib/types/response'
import { redirect } from 'next/navigation'
import { updateUserCategory } from './action'
import { revalidatePath } from 'next/cache'

const categories = Array(100)
    .fill('')
    .map((_) => ({
        id: faker.string.nanoid(10),
        name: faker.person.fullName(),
    }))

async function getCategories() {
    const { data, status, message, status_code } = await fetchRequest<
        ICategory[]
    >(`categories`)
    if (status === Status.OtpPending) redirect('/verify')

    if (status_code === 401) redirect('/login')
    return { categories: data, message }
}

async function getUserCategories() {
    const { data, status, message, status_code } = await fetchRequest<
        IUserCategory[]
    >(`user_categories`)
    if (status === Status.OtpPending) redirect('/verify')
    if (status_code === 401) redirect('/login')
    return { user_categories: data, message }
}

async function getUser() {
    const { data, status } = await fetchRequest<IUser>('user')
    if (status === Status.Failure) redirect('/login')
    return { user: data }
}

export default async function Categories() {
    const { user } = await getUser()
    const { categories, message } = await getCategories()
    const userId = user?.id as number
    const { user_categories } = await getUserCategories()

    async function handleUpdate(categoryId: number) {
        'use server'
        const { status, message } = await updateUserCategory({
            categoryId,
            userId,
        })
        if (status === Status.Success) revalidatePath('/categories')
        return { status, message }
    }

    return (
        <main className="flex flex-col items-center justify-between h-full py-6">
            {!categories || !user_categories ? (
                <p className="text-destructive">{message}</p>
            ) : (
                <Category
                    categories={categories}
                    user_categories={user_categories}
                    handleUpdate={handleUpdate}
                    userId={userId}
                />
            )}
        </main>
    )
}
