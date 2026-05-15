import InViewAnimate from "../components/InViewAnimate";

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
            <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778574438/rccgy/banner_bwmkzd.jpg" alt="Banner" className="w-full h-full object-cover rounded-lg animate-hero-enter" />
              <div className="hidden md:block lg:hidden my-5 animate-hero-enter">
                <p className="text-sm text-gray-300 font-semibold">WELCOME TO RUNCLUB:</p>
                <h1 className="text-4xl font-bold my-5">RANNN CREW CGY</h1>
              </div>
            </div>
            
             <div className="w-full md:w-1/2 flex flex-col gap-5 p-5 md:p-10 animate-hero-enter-right">
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

          <div className="w-full p-10 sm:px-5 xl:px-30 mt-5 flex flex-col md:gap-10 justify-center items-center bg-gray-700">
              <InViewAnimate enterClassName="animate-hero-enter" initialClassName="opacity-0 translate-y-4">
                <div className="w-full flex flex-col md:flex-row gap-5 md:gap-10 justify-center items-start md:px-10">
                  <div className="flex-2/3">
                    <h1 className="text-2xl md:text-5xl font-bold text-start font-mono md:mb-5">YOUR PACE IS OUR PACE</h1>
                    <h1 className="text-2xl md:text-5xl font-bold text-start font-mono">THE LEGACY OF RCCGY</h1>
                  </div>
                  <p className="flex-1/3 lg:text-justify xl:text-lg xl:font-semibold">It's more than just a run club — we are a synchronized movement. Built on grit and community, we ensure that no matter your goal, you never have to hit the pavement alone.</p>
                  <p className="flex-1/3 xl:text-lg xl:font-semibold">A journey of a thousand miles begins with a single step, but it's finished with a crew. </p>
                </div>
              </InViewAnimate>

              <InViewAnimate enterClassName="animate-hero-enter-right" initialClassName="opacity-0 translate-y-4">
                <div className="w-full flex flex-col md:flex-row gap-5 my-5 md:my-0 md:px-10">
                  <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778586031/rccgy/running_d3ueam.jpg" alt="Runner" className="md:w-3/5 object-cover rounded-lg" />
                  <div className="flex flex-col gap-10 items-center md:w-2/5">
                    <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778658412/rccgy/shoes_w65yx0.jpg" alt="Shoes" className="hidden md:block w-full h-full object-cover rounded-lg" />
                    <div className="w-full h-1/2 flex flex-col justify-center px-5 xl:px-15">
                      <div className="w-full flex flex-row justify-start items-center md:items-end gap-2 xl:gap-5 mb-5 font-mono">
                        <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold text-secondary">400+</h1>
                        <p className="md:text-sm xl:text-2xl font-bold">Members and Growing</p>
                      </div>
                      <li className="text-sm xl:text-lg my-2">From the first light of dawn to the city's night glow, our presence is felt across the city.</li>
                      <li className="text-sm xl:text-lg my-2">We have transformed the pavement into a stage for excellence, bringing together athletes, dreamers, and partners.</li>
                    </div>
                  </div>
                </div>
              </InViewAnimate>
          </div>


        </div>
      </div>
    </>
  );
}

export default About;
