import ForwardedIconComponent from "@/components/common/generic-icon-component"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useRef, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react"

export default function MediaImageComponent ({ image }: { image: any }) {

    const [isHovered, setIsHovered] = useState(false)
    const elRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const handleMouseEnter = (event: MouseEvent) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            setIsHovered(true);
        };
        
        const handleMouseLeave = (event: MouseEvent) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            setIsHovered(false);
        };

        if (elRef.current) {
            elRef.current.addEventListener('mousemove', handleMouseEnter);
            elRef.current.addEventListener('mouseout', handleMouseLeave);
        }

        return () => {
            elRef.current?.removeEventListener('mousemove', handleMouseEnter);
            elRef.current?.removeEventListener('mouseout', handleMouseLeave);
        }
    }, []);
    return (
        <div className='h-full'>
            <Tooltip open={isHovered} onOpenChange={setIsHovered}>
                <TooltipTrigger>
                    <div ref={elRef} key={image.id} className='border-muted-foreground'>
                        <div className='h-52 w-52 border-[16px] border-white'>
                            {image.text && <img src={image.text} className='h-full w-full object-cover' />}
                            {!image.text && <div className='h-full w-full bg-gray-400' />}
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent
                // onPointerEnter={() => setIsHovered(true)}
                // onPointerLeave={() => setIsHovered(false)}
                // onPointerOver={(e) => {
                //     e.preventDefault();
                //     e.stopPropagation();
                // }}
                // onPointerDownOutside={() => setIsHovered(false)}
                side="right"
                sideOffset={-72}
                alignOffset={19}
                align="start"
                className="p-0"
                children={<ToolTipContextMenu />}
                />
                <TooltipContent
                // onPointerDownOutside={() => setIsHovered(false)}
                side="right"
                sideOffset={-71}
                alignOffset={21}
                align="end"
                className="p-0"
                children={<DeleteMediaButton />}
                />
            </Tooltip>
        </div>
    )
}

// const ToolTipContextMenu = () => {
//     const [open, setOpen] = useState(false)
//     const elRef = useRef<HTMLDivElement>(null)
//     useEffect(() => {
//         if (elRef.current) {
//             // elRef.current.addEventListener('mouseleave', () => setOpen(false))
//         }
//         return () => {
//             // elRef.current?.removeEventListener('mouseleave', () => setOpen(false)) 
//         }
//     }, []) 
//     return (
//     <div ref={elRef}>
//             <DropdownMenu>
//             {!open && 
//                 <DropdownMenuTrigger>
//                 <Button size='sm' variant='ghost' onClick={() => setOpen(true)}>
//                 <ForwardedIconComponent name='ellipsis' />
//                 </Button>
//             </DropdownMenuTrigger>
//             }
//             <DropdownMenuContent>
//                 <DropdownMenuItem>
//                     <Button variant="ghost" className="relative h-5 w-5 rounded-full">
//                         <ForwardedIconComponent name='edit' />
//                     </Button>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                     <Button variant="ghost" className="relative h-5 w-5 rounded-full">
//                         <ForwardedIconComponent name="settings" /> 
//                     </Button>
//                 </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//     </div>
//     );
// }

const ToolTipContextMenu = React.memo(() => {
    const [open, setOpen] = useState(false)
    
    return (
        <div className="border h-full flex flex-col justify-between relative">
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button 
                        size='sm' 
                        variant='ghost'
                        // onMouseDown={(e) => e.stopPropagation()}
                        // onMouseUp={(e) => e.stopPropagation()}
                    >
                        <ForwardedIconComponent skipFallback name='ellipsis' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    className="h-full flex flex-col justify-between py-2"
                    sideOffset={0}
                    // onMouseDown={(e) => e.stopPropagation()}
                    // onMouseUp={(e) => e.stopPropagation()}
                >
                    <DropdownMenuItem>
                        <Button size="sm" variant="ghost">
                            <ForwardedIconComponent name='settings' />
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
})

// Add display name for debugging purposes
ToolTipContextMenu.displayName = 'ToolTipContextMenu'

const DeleteMediaButton = React.memo(() => {
    return (
        <Button 
            variant="ghost" 
            size="sm"
            className="text-destructive rounded-full"
        >
            <ForwardedIconComponent skipFallback name="Trash2" />
        </Button>
    )
})

// Add display name for debugging purposes
DeleteMediaButton.displayName = 'DeleteMediaButton'