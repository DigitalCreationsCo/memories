import { useToast } from "@/hooks/use-toast";
import { ForwardedIconComponent } from "@/components/common/generic-icon-component";
import { useStorage } from "@/hooks/use-storage";
import { useProjectMedia } from "@/hooks/use-project-media";
import { MediaType } from "@/types/media.types";
import { useState } from "react";

interface UploadMediaProps {
    projectId: string;
    onSuccess?: (media: MediaType[]) => void;
}

interface MediaFormData {
    name: string;
    description: string;
}

export function UploadMedia({ projectId, onSuccess }: UploadMediaProps) {
    const { createMediaItems } = useProjectMedia(projectId);
    const { toast } = useToast();
    const { uploadFiles, isUploading } = useStorage();
    const [formData, setFormData] = useState<MediaFormData>({
        name: '',
        description: ''
    });

    const handleUpload = async (files: FileList) => {
        try {
            // 1. Upload files to storage
            const fileArray = Array.from(files);
            const urls = await uploadFiles(fileArray, projectId);
            
            // 2. Prepare media items
            const mediaItems = await Promise.all(fileArray.map(async (file, index) => {
                const dimensions = await getImageDimensions(file);
                
                return {
                    url: urls[index],
                    type: file.type,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    project_id: projectId,
                    name: formData.name || file.name,
                    description: formData.description,
                    size: file.size,
                    mime_type: file.type,
                    ...dimensions
                };
            }));
            
            // 3. Create media items in database
            // This will automatically update React Query cache and trigger Zustand store sync
            const createdItems = await createMediaItems(mediaItems);
            
            // 4. Reset form and notify
            setFormData({ name: '', description: '' });
            toast({
                title: "Success",
                description: `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`,
            });
            
            onSuccess?.(createdItems);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload media",
                variant: "destructive",
            });
        }
    };

    // Helper function to get image dimensions
    const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.src = URL.createObjectURL(file);
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                <div>
                    <label htmlFor="media-name" className="block text-sm font-medium mb-1">
                        Name
                    </label>
                    <input
                        id="media-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-md border p-2"
                        placeholder="Media name"
                    />
                </div>
                <div>
                    <label htmlFor="media-description" className="block text-sm font-medium mb-1">
                        Description
                    </label>
                    <textarea
                        id="media-description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full rounded-md border p-2"
                        placeholder="Media description"
                        rows={3}
                    />
                </div>
            </div>

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
        </div>
    );
} 