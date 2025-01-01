import ForwardedIconComponent from "@/components/common/generic-icon-component"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useRef, useState, Suspense } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react"
import { ImageDialog } from "@/components/common/image-dialog"
import { deleteMedia } from "@/components/s3/actions"
import { useToast } from "@/hooks/use-toast"
import { MediaItem } from "@/types/media"

const LazyImage = ({ src, className }: { src: string, className: string }) => {
    return (
        <img 
            src={src} 
            className={className}
            loading="lazy"
            alt=""
        />
    )
}

export default function MediaImageComponent({ image, projectId }: { image: MediaItem, projectId: string }) {
    const { toast } = useToast()
    const [isHovered, setIsHovered] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    
    const elRef = useRef<HTMLDivElement>(null)
    const tooltipTimeoutRef = useRef<NodeJS.Timeout>()
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMouseEnter = () => {
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current)
        }
        setIsHovered(true)
    }

    const handleMouseLeave = (e: React.MouseEvent) => {
        // Check if we're moving to a tooltip-related element
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (relatedTarget?.closest('[role="tooltip"]')) {
            return;
        }

        tooltipTimeoutRef.current = setTimeout(() => {
            setIsHovered(false)
        }, 150)
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteMedia(image.key, projectId)
            if (!result.success) throw new Error(result.error)
            
            toast({
                title: "Success",
                description: "Media deleted successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete media",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div ref={containerRef} className="border border-black relative w-full h-full">
            <Tooltip
                open={isHovered}
                delayDuration={0}
            >
                <TooltipTrigger 
                    className="w-full h-full"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <ImageDialog image={image}>
                        <div ref={elRef} className={`w-full h-full ${isDeleting ? 'pointer-events-none' : ''}`}>
                            <Suspense fallback={
                                <div className="h-full w-full bg-gray-200 animate-pulse" />
                            }>
                                {image.url ? (
                                    <LazyImage 
                                        src={image.url} 
                                        className='h-full w-full object-cover'
                                    />
                                ) : (
                                    <div className='h-full w-full bg-gray-400' />
                                )}
                            </Suspense>
                        </div>
                    </ImageDialog>
                </TooltipTrigger>
                <TooltipContent
                    side="right"
                    align="start"
                    alignOffset={6}
                    style={{ transform: 'translateX(-125%)' }}
                    className="p-0"
                    onMouseEnter={handleMouseEnter}
                    avoidCollisions={true}
                    collisionBoundary={containerRef.current}
                    hideWhenDetached={true}
                    collisionPadding={10}
                >
                    <ToolTipContextMenu />
                </TooltipContent>
                <TooltipContent
                    side="bottom"
                    align="end"
                    alignOffset={6}
                    style={{ transform: 'translateY(-125%)' }}
                    className="p-0"
                    onMouseEnter={handleMouseEnter}
                    avoidCollisions={true}
                    collisionBoundary={containerRef.current}
                    hideWhenDetached={true}
                    collisionPadding={10}
                    // Try alternative sides if bottom is cut off
                    sideOffset={5}
                >
                    <div className="relative">
                        <DeleteButton 
                            isDeleting={isDeleting} 
                            setIsDeleting={setIsDeleting} 
                            onDelete={handleDelete} 
                        />
                    </div>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

const ToolTipContextMenu = React.memo(() => {
    const [open, setOpen] = useState(false)
    
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
    }

    return (
        <div>

        <DropdownMenu 
            open={open} 
            onOpenChange={handleOpenChange}
        >
            <DropdownMenuTrigger>
                {!open && <Button 
                    size='icon' 
                    variant='ghost'
                    className={`rounded-none`}
                >
                    <ForwardedIconComponent skipFallback name='ellipsis' />
                </Button>}
            </DropdownMenuTrigger>
            {open && 
            <DropdownMenuContent 
                className="flex flex-col justify-between py-2"
                sideOffset={0}
                onMouseOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true)
                }}
                onMouseLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const relatedTarget = e.relatedTarget as HTMLElement;
                    if (!relatedTarget?.closest('[role="menu"]')) {
                        setOpen(false)
                    }
                }}
                onMouseMoveCapture={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true)
                }}
                onMouseOverCapture={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true)
                }}
                onMouseOutCapture={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const relatedTarget = e.relatedTarget as HTMLElement;
                    if (!relatedTarget?.closest('[role="menu"]')) {
                        setOpen(false)
                    }
                }}
            >
                <DropdownMenuItem>
                    <Button size="icon" variant="ghost">
                        <ForwardedIconComponent name='settings' />
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
            }
        </DropdownMenu>
        </div>
    );
})

ToolTipContextMenu.displayName = 'ToolTipContextMenu'

const DeleteButton = React.memo(({ onDelete, isDeleting, setIsDeleting }: { onDelete: () => void, isDeleting: boolean, setIsDeleting: (isDeleting: boolean) => void }) => {
    const [confirmDelete, setConfirmDelete] = useState(false)
    
    return (
        <Button 
            variant="ghost" 
            size={confirmDelete ? "default" : "icon"}
            className={`aspect-square transition-all duration-200 ${
                isDeleting ? 'cursor-not-allowed opacity-50' :
                confirmDelete ? 'text-red-600 hover:text-red-700' : 
                'text-destructive hover:text-red-600'
            }`}
            disabled={isDeleting}
            onClick={async () => {
                if (!confirmDelete) {
                    setConfirmDelete(true);
                    setTimeout(() => setConfirmDelete(false), 3000);
                } else {
                    setIsDeleting(true);
                    setConfirmDelete(false);
                    try {
                        await onDelete();
                        // await 5 seconds
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    } finally {
                        setIsDeleting(false);
                        setConfirmDelete(false);
                    }
                }
            }}
        >
            {isDeleting && (
                <ForwardedIconComponent skipFallback name="Loader2" className='animate-in spin-in animate-spin' />
            ) || confirmDelete && (
                <p>Really delete?</p>
            ) || (
                <ForwardedIconComponent skipFallback name="Trash2" />
            )}
        </Button>
    )
})

// Add display name for debugging purposes
DeleteButton.displayName = 'DeleteButton'