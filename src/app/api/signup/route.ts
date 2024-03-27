import { signup } from "lib/services/auth"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  return signup(req)
}
