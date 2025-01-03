import { getMediaItems, getMediaItemsMultiple } from '@/db/queries/media'
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

    const mediaItems = await getMediaItems(projectId)
    return NextResponse.json(mediaItems)
  } catch (error) {
    console.error('Failed to fetch media items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media items' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { mediaIds } = await request.json()
    
    if (!mediaIds || !Array.isArray(mediaIds)) {
      return NextResponse.json(
        { error: 'Invalid or missing mediaIds array in request body' },
        { status: 400 }
      )
    }

    const mediaItems = await getMediaItemsMultiple(params.id, mediaIds)
    return NextResponse.json(mediaItems)
  } catch (error) {
    console.error('Failed to fetch media items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media items' },
      { status: 500 }
    )
  }
}