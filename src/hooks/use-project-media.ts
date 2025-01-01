import { getProjectMedia } from "@/components/s3/actions"
import { UseRequestProcessor } from "@/controllers/api/services/request-processor";

export function useProjectMedia(projectId: string, options?: any) {

    const { mutate } = UseRequestProcessor();

    const mutation = mutate(
        ["useGetProjectMedia"],
        () => getProjectMedia(projectId),
        options
    )
    
    return mutation
} 