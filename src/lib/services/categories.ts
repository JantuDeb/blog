import { NextRequest, NextResponse } from "next/server"
import prisma from "lib/prisma"
import { Status } from "lib/types/response"
export async function getAllCategories(request: NextRequest) {
  try {
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
    console.log(error)

    return NextResponse.json(
      { message: "Failed to load categories", status: Status.Failure },
      { status: 500 }
    )
  }
}
