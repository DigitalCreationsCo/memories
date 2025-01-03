import { NextRequest, NextResponse } from "next/server"
import { createMedia } from '@/db/queries/media'
import { MediaType } from "@/types/media.types"

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { items } = await request.json() as { items: MediaType[] }
      const createItems = []
      for (const media of items) {

          if (!media.url || !media.type) {
              return NextResponse.json(
                  { error: 'Missing required fields: url or type' },
                  { status: 400 }
                )
            }
            
            const mediaItem = await createMedia(params.id, media)
            createItems.push(mediaItem)
        }
        
        return NextResponse.json(createItems)
    } catch (error) {
      console.error('Failed to create media item:', error)
      return NextResponse.json(
        { error: 'Failed to create media item' },
        { status: 500 }
      )
    }
  }