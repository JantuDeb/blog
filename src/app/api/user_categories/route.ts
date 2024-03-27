import {
    getUserCategories,
    updateUserCategories,
} from 'lib/services/categories'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    return getUserCategories(req)
}

export async function POST(req: NextRequest) {
    return updateUserCategories(req)
}
