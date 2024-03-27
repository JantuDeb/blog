import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

async function main() {
    console.log(`Start seeding ...`)
    const password = 'Password123' // Generic password for seeding
    const hashedPassword = await bcrypt.hash(password, 10) // Hashing the password

    console.log(`Start seeding ...`)

    // Generate category data
    const categoryData = Array.from({ length: 100 }, (_, index) => ({
        name: `${faker.commerce.department()} ${index}`, // Ensure unique names
    }))

    await prisma.category.createMany({
        data: categoryData,
    })

    console.log(`Created 100 categories.`)
    // Create one user
    const user = await prisma.user.create({
        data: {
            name: faker.person.fullName(), // Generates a random user name
            email: faker.internet.email(), // Generates a random email
            password: hashedPassword,
        },
    })

    const categories = await prisma.category.findMany({
        take: 20,
        select: { id: true, name: true },
        orderBy: {
            name: 'asc', // or 'desc' if you want it in descending order
        },
    })

    const userCategory = categories.map(
        (category: { id: number; name: string }) => ({
            categoryId: category.id,
            userId: user.id,
        })
    )

    await prisma.userCategory.createMany({ data: userCategory })

    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
