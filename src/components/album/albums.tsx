import { Suspense } from "react"
import { Loading, Error as ErrorComponent } from "@/components/common"
import { useParams } from "next/navigation"
import MediaImageComponent from "../media/media-image-component"
import MediaGrid from "../media/media-grid-component"
import MediaItem from "../media/media-item-component"
import { useAlbums } from "@/hooks/use-albums"

export default function Albums() {
    const params = useParams()
    const projectId = params.project as string
    const { albums, isLoading, error, isEmpty } = useAlbums(projectId)

    if (isLoading) return <Loading />
    if (error) return <ErrorComponent message={error} />
    if (isEmpty) return <div>No albums found</div>

    return (
        <MediaGrid>
            {albums.map((album) => (
                <MediaItem key={album.id}>
                    <Suspense fallback={
                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                    }>
                        {album.media_ids?.[0] && (
                            <MediaImageComponent 
                                image={{ key: album.media_ids[0] }} 
                                projectId={projectId}
                            />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
                            <h3 className="text-sm font-medium">{album.name}</h3>
                            <p className="text-xs">{album.media_ids?.length || 0} items</p>
                        </div>
                    </Suspense>
                </MediaItem>
            ))}
        </MediaGrid>
    )
}