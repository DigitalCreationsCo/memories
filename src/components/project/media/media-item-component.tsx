const MediaItem = ({ children }: { children: React.ReactNode }) => (
    <div className="shadow-lg relative aspect-square border-[16px] border-white bg-white">
        <div className="absolute inset-0">
            {children}
        </div>
    </div>
)

export default MediaItem