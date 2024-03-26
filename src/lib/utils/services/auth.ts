import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "dev"

export async function signup(request: NextRequest) {
    const { name, email, password } = await request.json()
    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: { id: true, name: true, email: true }, // Avoid returning the password
        });

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' })

        const response = new NextResponse(JSON.stringify({ user, success: true }), { status: 200 })
        response.cookies.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; SameSite=Strict`)
        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: 500 })
    }
}


export async function login(request: NextRequest) {
    const { email, password } = await request.json();
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password)))
            return NextResponse.json({ error: "Email or password is incorrect" }, { status: 401 })


        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });

        const response = new NextResponse(JSON.stringify({ user: { ...user, password: undefined }, success: true }));
        response.cookies.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; SameSite=Strict`);

        return response;
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}


export function logout(request: NextRequest) {
    let response = NextResponse.redirect("/login")
    response.cookies.delete('Set-Cookie')
    return response;
}
