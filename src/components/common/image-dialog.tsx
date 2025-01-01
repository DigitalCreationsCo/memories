import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react"

interface ImageDialogProps {
    children: ReactNode
    image: {
        text?: string
        id: string
    }
}

export function ImageDialog({ children, image }: ImageDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center">
                {image.text && (
                    <img 
                        src={image.text} 
                        className='max-w-full max-h-full w-full md:w-auto object-contain'
                        alt="Full size preview"
                    />
                )}
            </DialogContent>
        </Dialog>
    )
} 