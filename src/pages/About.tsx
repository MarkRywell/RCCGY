function About() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col">
        <div className="relative w-full overflow-hidden p-10 md:p-15">
          
          <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778574293/rccgy/running7_unc7ac.jpg" alt="Running Group" className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
          
          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          { /* content */ }
          <div className="relative h-full z-10 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-bold font-mono">ABOUT US</h1>
          </div>
        </div>

        <div className="w-full h-full flex flex-col justify-center items-center bg-gray-800 text-white py-10 px-5 sm:px-10 xl:px-30">
          <div className="w-full flex flex-col md:flex-row">
            <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778574438/rccgy/banner_bwmkzd.jpg" alt="Banner" className="w-full md:w-1/2 h-full object-cover" />
            <div className="w-full md:w-1/2 flex flex-col gap-5 p-5 md:p-10">
              <p className="text-sm text-gray-300 font-semibold">WELCOME TO RUNCLUB:</p>
              <h1 className="text-4xl font-bold">RANNN CREW CGY</h1>
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

          <div>
            
          </div>

        </div>
      </div>
    </>
  );
}

export default About;
