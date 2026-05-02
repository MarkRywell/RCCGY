import EventCard from "../components/EventCard";


function Events() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col">
        <div className="relative w-full overflow-hidden p-10 md:p-15">
          
          <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1777606832/rccgy/announcer_hccfd9.jpg" alt="Event Announcer" className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" />
          
          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          { /* content */ }
          <div className="relative h-full z-10 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-bold">OUR EVENTS</h1>
          </div>
        </div>

        <div className="w-full h-full flex flex-col gap-2 justify-center items-center bg-gray-800 text-white py-8 px-5 sm:px-10 xl:px-30">
          <p className="text-sm font-semibold">RUNNING EVENTS</p>
          <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
            <h2 className="text-3xl font-bold mt-2">UPCOMING EVENTS</h2>
            <p>Coming Soon...</p>
          </div>

          <div className="w-full h-full flex flex-col gap-5 items-center justify-center border-t-2 border-gray-400 mt-10 pt-10">
            <h2 className="text-3xl font-bold mt-2">WEEKLY EVENTS</h2>

            <div className="flex flex-col gap-8 w-full">
              <EventCard
                title="Monday Strides"
                location="Rio De Oro Boulevard"
                image="https://res.cloudinary.com/di8bd6f96/image/upload/v1777606832/rccgy/running1_o18557.jpg"
              />
              <EventCard
                title="Speed Wednesday"
                location="Rio De Oro Boulevard"
                image="https://res.cloudinary.com/di8bd6f96/image/upload/v1777710072/rccgy/run1_ds3exk.jpg"
              />
              <EventCard
                title="Friday Community Run"
                location="Rio De Oro Boulevard"
                image="https://res.cloudinary.com/di8bd6f96/image/upload/v1777606831/rccgy/stretching_t06x4t.jpg"
              />
            </div>
          </div>

        </div>
       

      </div>
    </>
  );
}

export default Events;
