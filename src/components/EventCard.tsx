
function EventCard ({ image, title, date, description }: { image: string; title: string; date: string; description: string }) {
    return (
        <>
        <div className="w-full h-full flex flex-col gap-4 bg-gray-700 rounded-lg overflow-hidden">
            <img src={image} alt={title} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm text-gray-300">{date}</p>
                <p className="text-gray-200">{description}</p>
            </div>
        </div>
        </>
    )
}

export default EventCard;