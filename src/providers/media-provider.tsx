import { useEffect } from 'react'
import { useMediaStore } from '@/store/mediaStore'
import { useParams } from 'next/navigation'

interface MediaProviderProps {
    children: React.ReactNode
}

export function MediaProvider({ children }: MediaProviderProps) {
    const params = useParams()
    const projectId = params.project as string
    const { fetchAlbums, isLoading } = useMediaStore()

    useEffect(() => {
        if (projectId) {
            fetchAlbums(projectId)
        }
    }, [projectId, fetchAlbums])

    // You might want to show a loading state while initial data is being fetched
    if (isLoading) {
        return <div>Loading media...</div>
    }

    return <>{children}</>
}