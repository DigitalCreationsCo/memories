import { Suspense } from "react"
import { Loading, Error as ErrorComponent } from "@/components/common"
import { useParams } from "next/navigation"
import MediaImageComponent from "./media-image-component"
import { UploadMedia } from "./upload-media"
import MediaGrid from "./media-grid-component"
import MediaItem from "./media-item-component"
import { useMediaStore } from "@/hooks/use-media-store"

export default function Media() {
    const params = useParams()
    const projectId = params.project as string
    
    const{ items, error, isLoading } =useMediaStore()

    if (isLoading) return <Loading />
    if (error) return <ErrorComponent message={error.message} />

    return (
        <MediaGrid>
            <UploadMedia 
                projectId={projectId} 
            />
            
            {items.map((image) => (
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