
function EventCard ({ image, title, location }: { image: string; title: string; location: string }) {
    return (
        <>
        <div className="relative w-full min-h-40 max-h-40 xl:max-h-60 rounded-xl overflow-hidden flex">
            <div className="absolute top-0 left-0 w-2/4 sm:w-1/3 h-full flex flex-col gap-2 bg-dark [clip-path:polygon(0_0,75%_0,100%_50%,75%_100%,0_100%)] p-4 xl:p-10 justify-center text-white font-mono">
                <h2 className="text-base xs:text-lg lg:text-2xl font-bold">{title}</h2>
                <div className="flex gap-1 items-center">
                    <svg
                        className="h-4 w-4  fill-secondary"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path d="M12 2c-3.86 0-7 3.14-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                    </svg>
                    <p className="text-xs xs:text-sm lg:text-lg">{location}</p>
                </div>
            </div>
            
            <div>
                <img src={image} alt={title} className="h-full w-full object-cover xl:pl-60" />
            </div>
        </div>
        </>
    )
}

export default EventCard;