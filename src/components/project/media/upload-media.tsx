import { uploadMedia } from "@/components/s3/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ForwardedIconComponent } from "@/components/common/generic-icon-component";

interface UploadMediaProps {
    projectId: string;
    onSuccess?: (media: any) => void;
}

export function UploadMedia({ projectId, onSuccess }: UploadMediaProps) {
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (files: FileList) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('projectId', projectId);
        
        try {
            for (const file of files) {
                formData.set('file', file);
                const result = await uploadMedia(formData);
                
                if (!result.success) {
                    throw new Error(result.error);
                }
            }
            
            toast({
                title: "Success",
                description: `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`,
            });
            
            onSuccess?.();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload media",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
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