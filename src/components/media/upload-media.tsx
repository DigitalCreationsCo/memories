import { useToast } from "@/hooks/use-toast";
import { ForwardedIconComponent } from "@/components/common/generic-icon-component";
import { useStorage } from "@/hooks/use-storage";
import { STORAGE_KEYS } from '@/utils/storage.utils'
import { useMediaStore } from "@/hooks/use-media-store";

interface UploadMediaProps {
    projectId: string;
    onSuccess?: (media: any[]) => void;
}

export function UploadMedia({ projectId, onSuccess }: UploadMediaProps) {
    const { addMediaItems } = useMediaStore()
    const { toast } = useToast();
    const { uploadFiles, isUploading } = useStorage();

    const handleUpload = async (files: FileList) => {
        try {
            const fileArray = Array.from(files);
            const urls = await uploadFiles(fileArray, projectId);
            
            const newMediaItems = urls.map((url, index) => ({
                id: crypto.randomUUID(),
                url,
                type: fileArray[index].type,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                project_id: projectId
            }))
            
            addMediaItems(newMediaItems)

            toast({
                title: "Success",
                description: `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`,
            });
            
            onSuccess?.(newMediaItems);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload media",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="relative">
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
                className="hidden"
                id="media-upload"
                disabled={isUploading}
            />
            <label
                htmlFor="media-upload"
                className={`
                    cursor-pointer 
                    border-2 
                    border-dashed 
                    border-gray-300 
                    rounded-lg 
                    p-4 
                    text-center
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    min-h-[200px]
                    transition-all
                    duration-200
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-secondary/50'}
                `}
            >
                {isUploading ? (
                    <>
                        <ForwardedIconComponent 
                            name="Loader2" 
                            className="w-6 h-6 animate-spin" 
                        />
                        <span>Uploading...</span>
                    </>
                ) : (
                    <>
                        <ForwardedIconComponent 
                            name="Upload" 
                            className="w-6 h-6" 
                        />
                        <span>Upload Media</span>
                        <span className="text-sm text-muted-foreground">
                            Drag and drop or click to select
                        </span>
                    </>
                )}
            </label>
        </div>
    );
} 