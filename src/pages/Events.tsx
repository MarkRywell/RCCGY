function Events() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col">
        <div className="relative min-h-1/6 w-full overflow-hidden p-15">
          <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1777606832/announcer_hccfd9.jpg" alt="Event Announcer" className="absolute inset-0 h-full w-full object-cover object-[center-top]" />
          
          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          { /* content */ }
          <div className="relative h-full z-10 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-bold">OUR EVENTS</h1>
          </div>
        </div>

        <div className="w-full h-full flex flex-col gap-2 justify-center items-center bg-gray-800 text-white py-8 px-5">
          <p className="text-sm font-semibold">RUNNING EVENTS</p>
          <div>
            <h2 className="text-3xl font-bold mt-2">UPCOMING EVENTS</h2>

            
          </div>

          <div>
            <h2 className="text-3xl font-bold mt-2">WEEKLY EVENTS</h2>
          </div>

        </div>
       

      </div>
    </>
  );
}

export default Events;
