import { logout } from "lib/utils/services/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    return logout(req)
}