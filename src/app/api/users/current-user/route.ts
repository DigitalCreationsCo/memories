import { getUser } from "@/db/queries/user"
import { getSession } from "next-auth/react"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { user } = session
        const userData = await getUser(user.id!)
        return NextResponse.json({ data: userData }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
