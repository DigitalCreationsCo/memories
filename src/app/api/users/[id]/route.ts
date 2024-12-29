import { NextRequest } from "next/server"
import { getUser } from "@/db/queries/user"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        // get id from request query params
        const id = request.nextUrl.searchParams.get("id")
        const user = await getUser(id!)
        return NextResponse.json({ data: user }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}       