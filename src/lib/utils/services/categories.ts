import { NextRequest, NextResponse } from 'next/server';
import prisma from 'lib/prisma'
export async function getAllCategories(request: NextRequest) {

  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 })
  }

}
