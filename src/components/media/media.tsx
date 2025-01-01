import { Suspense } from "react"
import { Loading, Error as ErrorComponent } from "@/components/common"
import { useProjectMedia } from "@/hooks/use-project-media"
import { useParams } from "next/navigation"
import MediaImageComponent from "./media-image-component"
import { UploadMedia } from "./upload-media"
import MediaGrid from "./media-grid-component"
import MediaItem from "./media-item-component"
import { MediaType } from "@/types/media.types"

export default function Media() {
    const params = useParams()
    const projectId = params.project as string
    
    const { 
        data, 
        isPending: isLoading, 
        error,
        mutateAsync,
    } = useProjectMedia(projectId)

    if (isLoading) return <Loading />
    if (error) return <ErrorComponent message={error.message} />

    return (
        <MediaGrid>
            <UploadMedia 
                projectId={projectId} 
                onSuccess={(media:MediaType) => {
                    mutateAsync({
                        ...media,
                        project_id: projectId,
                    })
                }}
            />
            
            {data?.media?.map((image:MediaType) => (
                <MediaItem key={image.id}>
                    <Suspense 
                        fallback={
                            <div className="w-full h-full bg-gray-200 animate-pulse" />
                        }
                    >
                        <MediaImageComponent 
                            image={image} 
                            projectId={projectId} 
                        />
                    </Suspense>
                </MediaItem>
            ))}
        </MediaGrid>
    )
}