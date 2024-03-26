"use client"

import { Card } from "components/card"
import { faker } from "@faker-js/faker"
import { Label } from "components/label"
import { Input } from "components/input"
import { Checkbox } from "components/checkbox"
import PaginationCLient from "components/pagination-client"
import { useState } from "react"
const categories = Array(100)
  .fill("")
  .map((_) => ({
    id: faker.string.nanoid(10),
    name: faker.person.fullName(),
  }))

export default function Categories() {
  const [currentPage, setCurrentPage] = useState(4)
  return (
    <main className="flex flex-col items-center justify-between h-full py-6">
      <Card className="max-h-[30rem] overflow-y-auto w-full max-w-md p-4">
        <div className="space-y-4">
          {categories.map(({ id, name }) => {
            return (
              <div key={id} className="flex items-center gap-4 ">
                <Checkbox id={id} />
                <Label htmlFor={id} className="text-center">
                  {name}
                </Label>
              </div>
            )
          })}
        </div>
        <PaginationCLient
          totalCount={100}
          pageSize={10}
          currentPageIndex={currentPage}
          onChangePage={(page) => setCurrentPage(page)}
        />
      </Card>
    </main>
  )
}
