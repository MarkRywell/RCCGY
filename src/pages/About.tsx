function About() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col bg-gray-800 ">
        <div className="relative w-full overflow-hidden p-10 md:p-15">
          
          <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778574293/rccgy/running7_unc7ac.jpg" alt="Running Group" className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
          
          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          { /* content */ }
          <div className="relative h-full z-10 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-bold font-mono">ABOUT US</h1>
          </div>
        </div>

        <div className="w-full h-full flex flex-col justify-center items-center text-white py-10">
          <div className="w-full flex flex-col md:flex-row justify-center items-center px-5 sm:px-10 xl:px-30">
            <div className="w-full md:w-1/2">
            <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778574438/rccgy/banner_bwmkzd.jpg" alt="Banner" className="w-full h-full object-cover rounded-lg" />
              <div className="hidden md:block lg:hidden my-5">
                <p className="text-sm text-gray-300 font-semibold">WELCOME TO RUNCLUB:</p>
                <h1 className="text-4xl font-bold my-5">RANNN CREW CGY</h1>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col gap-5 p-5 md:p-10">
              <p className="text-sm text-gray-300 font-semibold block md:hidden lg:block">WELCOME TO RUNCLUB:</p>
              <h1 className="text-4xl font-bold block md:hidden lg:block">RANNN CREW CGY</h1>
              <p className="border-b pb-5">In the quiet streets of <span className="font-semibold">Puntod, Cagayan de Oro</span>, a small group of strangers found a common rhythm. What began as a humble effort to stay active evolved into the grit of finishing the next kilometer together. We didn't just start a club; we sparked a change.</p>
            
              <div className="flex w-full items-center gap-5">
                <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778576263/rccgy/bunny_r4ava2.png" className="w-16 h-16 object-cover rounded-full" />
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">Bunny Dela Cruz</p>
                  <p className="text-sm text-gray-300">Founder</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full px-10 sm:px-10 xl:px-30 mt-5 py-5 flex flex-col md:flex-row md:gap-10 justify-center items-center bg-gray-600">
            <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1777606832/rccgy/running_d3ueam.jpg" alt="Runner" className="w-full h-full md:hidden object-cover rounded-lg mb-5" />
            <div className="w-full md:w-1/2">
              <h1 className="text-2xl font-bold my-5 text-start">THE MOVEMENT</h1>
              <p>Today, RCCGY is a synchronized movement. We have transformed the pavement into a stage for excellence, bringing together athletes, dreamers, and partners. From the first light of dawn to the city's night glow, our presence is felt across the city.</p>
            </div>
            <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1777606832/rccgy/running_d3ueam.jpg" alt="Runner" className="w-full h-full hidden md:block md:w-2/4 lg:w-1/3 md:h-1/3 md:object-cover rounded-lg mb-5" />
          </div>

        </div>
      </div>
    </>
  );
}

export default About;
