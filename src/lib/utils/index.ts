import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getFullUrl(url: string) {
    const baseUrl =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3001/api'
            : ` ${process.env.NEXT_PUBLIC_CLIENT_URL}/api`
    return `${baseUrl}/${url}`
}
