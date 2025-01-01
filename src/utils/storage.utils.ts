import { STORAGE_PATHS } from "@/constants/constants";

export const STORAGE_KEYS = {
    getMediaKey: (projectId: string, mediaId: string): string => 
        `${STORAGE_PATHS.PROJECTS}/${projectId}/${STORAGE_PATHS.MEDIA}/${mediaId}`,
    
    getMediaPrefix: (projectId: string): string => 
        `${STORAGE_PATHS.PROJECTS}/${projectId}/${STORAGE_PATHS.MEDIA}`,
        
    parseMediaKey: (key: string): { projectId: string; mediaId: string } | null => {
        const parts = key.split('/')
        if (parts.length !== 4 || parts[0] !== STORAGE_PATHS.PROJECTS || parts[2] !== STORAGE_PATHS.MEDIA) {
            return null
        }
        return {
            projectId: parts[1],
            mediaId: parts[3]
        }
    }
} as const