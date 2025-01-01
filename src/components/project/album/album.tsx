import { useParams } from 'next/navigation'
import { useMediaStore } from '@/store/mediaStore'
import { useEffect } from 'react'
import { Loading, Error as ErrorComponent } from "@/components/common"
import MediaGrid from "../media/media-grid-component"
import MediaItem from "../media/media-item-component"
import MediaImageComponent from "../media/media-image-component"
import { Suspense } from 'react'

export function Album({ albumId }: { albumId: string }) {
  const params = useParams()
  const projectId = params.project as string
  const { albums, isLoading, error, fetchAlbums } = useMediaStore()
  
  useEffect(() => {
    fetchAlbums(projectId)
  }, [projectId, fetchAlbums])

  if (isLoading) return <Loading />
  if (error) return <ErrorComponent message={error} />

  const album = albums[projectId]?.find(a => a.id === albumId)
  if (!album) return <ErrorComponent message="Album not found" />

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{album.name}</h1>
        <p className="text-gray-500">{album.media_ids?.length || 0} items</p>
      </div>

      <MediaGrid>
        {album.media_ids?.map((mediaId) => (
          <MediaItem key={mediaId}>
            <Suspense fallback={
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            }>
              <MediaImageComponent 
                image={{ key: mediaId }} 
                projectId={projectId}
              />
            </Suspense>
          </MediaItem>
        ))}
      </MediaGrid>

      {(!album.media_ids || album.media_ids.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No media items in this album
        </div>
      )}
    </div>
  )
} 