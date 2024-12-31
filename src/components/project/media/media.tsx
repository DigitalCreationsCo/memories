import { Loading } from "@/components/common";
import { Suspense } from "react";

const mockImages = [
    {id: 1, text: 'https://picsum.photos/200/300'},
    {id: 2, text: 'https://picsum.photos/200/300'},
    {id: 3, text: 'https://picsum.photos/200/300'},
    {id: 4, text: 'https://picsum.photos/200/300'},
    {id: 5, text: 'https://picsum.photos/200/300'},
]
// await a timeout
const asyncImages = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockImages
}
export default function Media({ images }: { images: File[] }) {
    return (
        <div className='flex flex-wrap bg-secondary gap-8 p-5'>
            <Suspense fallback={Array.from({length: 5}).map((_, index) => <Loading key={index} />)}>
                {asyncImages().then((images) => {
                    return images.map((image) => (
                        <div key={image.id} className='border-muted-foreground'>
                            <div className='border-[16px] border-white'>
                                <img src={image.text} className='aspect-auto' />
                            </div>
                        </div>
                    ))
                })}
            </Suspense>
        </div>
    )
}