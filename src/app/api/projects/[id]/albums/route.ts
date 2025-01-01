import { getAlbums } from '@/db/queries/album'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get userId from query params if needed
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('id')
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing project id' },
        { status: 400 }
      )
    }

    const albums = await getAlbums(projectId)
    return NextResponse.json(albums)
  } catch (error) {
    console.error('Failed to fetch albums:', error)
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    )
  }
}