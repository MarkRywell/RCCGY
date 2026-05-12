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
            <h1 className="text-4xl font-bold">ABOUT US</h1>
          </div>
        </div>

        <div className="w-full h-full flex flex-col justify-center items-center bg-gray-800 text-white py-10 px-5 sm:px-10 xl:px-30">
          <div className="w-full flex">
            <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778574438/rccgy/banner_bwmkzd.jpg" alt="Banner" className="w-1/2 h-full object-cover" />
            <div className="w-1/2 flex flex-col gap-5 p-10">
              <p>WELCOME TO RUNCLUB:</p>
              <h1>RANNN CREW CGY</h1>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default About;
