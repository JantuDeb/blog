import { getAllCategories } from "lib/services/categories"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  return getAllCategories(req)
}
