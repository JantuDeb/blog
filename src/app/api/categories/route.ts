import { getAllCategories } from "lib/utils/services/categories";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
    return getAllCategories(req)
}