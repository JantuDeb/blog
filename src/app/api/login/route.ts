import { login } from "lib/utils/services/auth"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  return login(req)
}


