import { UseRequestProcessor } from "@/controllers/api/services/request-processor";
import { getMediaItems } from "@/db/queries/media";
import { MediaType } from "@/types/media.types";

interface ProjectMediaReturn {
    mediaItems: MediaType[];
    isLoading: boolean;
    error: Error | null;
    createMediaItems: (items: Omit<MediaType, 'id'>[]) => Promise<MediaType[]>;
    deleteMediaItem: (mediaId: string) => Promise<string>;
}

export function useProjectMedia(projectId: string): ProjectMediaReturn {
    const { mutate, query, queryClient } = UseRequestProcessor();

    // Fetch media items with error handling
    const { data: mediaItems, isLoading, error } = query(
        ["projectMedia", projectId],
        () => getMediaItems(projectId)
    );

    // Create media items
    const createMediaItems = async (items: Omit<MediaType, 'id'>[]) => {
        return mutate(
            ["projectMedia", projectId],
            async () => {
                const response = await fetch(`/api/projects/${projectId}/media/create`, {
                    method: 'POST',
                    body: JSON.stringify({ items })
                });
                return response.json();
            },
            {
                // Update React Query cache with new items
                onSuccess: (newItems) => {
                    const previousData = queryClient.getQueryData(["projectMedia", projectId])as any[] || [];
                    queryClient.setQueryData(["projectMedia", projectId], [...previousData, ...newItems]);
                }
            }
        ).data
    };

    // Delete media item
    const deleteMediaItem = (mediaId: string) => {
        return mutate(
            ["projectMedia", projectId],
            async () => {
                await fetch(`/api/projects/${projectId}/media/${mediaId}`, {
                    method: 'DELETE'
                });
                return mediaId;
            },
            {
                // Remove item from cache
                onSuccess: (deletedId) => {
                    const previousData = queryClient.getQueryData(["projectMedia", projectId]) as any[] || [];
                    queryClient.setQueryData(
                        ["projectMedia", projectId],
                        previousData.filter((item: MediaType) => item.id !== deletedId)
                    );
                }
            }
        ).data
    };

    return {
        mediaItems: mediaItems || [],
        isLoading,
        error,
        createMediaItems,
        deleteMediaItem
    };
}