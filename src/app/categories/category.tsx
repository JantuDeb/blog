'use client'
import { Card } from 'components/card'
import { Checkbox } from 'components/checkbox'
import { Label } from 'components/label'
import PaginationClient from 'components/pagination-client'
import { ICategory, IUserCategory } from 'lib/types'
import { ApiResponse } from 'lib/types/response'
import React, { useState } from 'react'
const pageSize = 10

function getPaginatedCategories(
    categories: Array<ICategory>,
    pageSize: number,
    currentPage: number
) {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return categories.slice(startIndex, endIndex)
}
export default function Category({
    categories,
    user_categories,
    userId,
    handleUpdate,
}: {
    categories: Array<ICategory>
    user_categories: Array<IUserCategory>
    handleUpdate: (categoryId: number) => Promise<ApiResponse<any>>
    userId: number
}) {
    const [currentPage, setCurrentPage] = useState(1)
    const [userCategories, setUserCategories] = useState(user_categories)

    const paginatedCategories = getPaginatedCategories(
        categories,
        pageSize,
        currentPage
    )

    function getIsSelected(id: number) {
        return userCategories.some((cat) => cat.categoryId === id)
    }

    function handleChange(id: number) {
        const index = userCategories.findIndex((cat) => cat.categoryId === id)
        let newUserCategories = []

        if (index > -1)
            newUserCategories = userCategories.filter(
                (cat) => cat.categoryId !== id
            )
        else {
            const newCat = { categoryId: id, userId }
            newUserCategories = [...userCategories, newCat]
        }

        setUserCategories(newUserCategories)
        handleUpdate(id)
    }

    return (
        <Card className="max-h-[36rem] overflow-y-auto w-full max-w-sm p-4 space-y-2 text-center">
            <h2 className="h3">Please mark your interests!</h2>
            <p>We will keep you notified.</p>
            <div className="space-y-4 px-6 pt-2">
                <p className="h4 text-start">My saved interests!</p>
                {paginatedCategories.map(({ id, name }) => {
                    const isSelected = getIsSelected(id)
                    return (
                        <div key={id} className="flex items-center gap-4 ">
                            <Checkbox
                                id={String(id)}
                                checked={isSelected}
                                onClick={() => handleChange(id)}
                            />
                            <Label
                                htmlFor={String(id)}
                                className=" cursor-pointer"
                            >
                                {name}
                            </Label>
                        </div>
                    )
                })}
            </div>

            <PaginationClient
                totalCount={categories.length}
                pageSize={pageSize}
                currentPageIndex={currentPage}
                onChangePage={(page) => setCurrentPage(page)}
            />
        </Card>
    )
}
