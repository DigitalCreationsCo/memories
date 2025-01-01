
const MediaGrid = ({ children }: { children: React.ReactNode }) => (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5 bg-secondary'>
        {children}
    </div>
)

export default MediaGrid