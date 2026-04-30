import BannerImage from '../assets/images/banner.jpg';
import LaborDay from '../assets/images/events/labor-day.jpg';


function Home() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col">
        <div className="relative h-screen xl:h-screen w-full">
          <img src={BannerImage} alt="RANNN Crew banner" className="absolute inset-0 h-full w-full object-cover" />

          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          <div className='relative h-full z-10 flex flex-col sm:flex-row justify-between sm:items-center px-10 py-16 gap-5 sm:px-20 sm:py-10 sm:gap-5 xl:gap-40'>
            <div className='flex flex-col gap-4 text-white sm:flex-3 xl:justify-start xl:items-start'>
              <div className='hidden lg:block'>
                <h1 className="text-6xl lg:text-5xl font-bold">
                  Rannn <span className="text-secondary">Crew</span> CGY
                </h1>
                <h2 className='text-2xl xl:font-semibold'><span className="text-secondary">runnr</span>club</h2>
              </div>

              <h2 className='text-3xl sm:text-4xl font-semibold'>Your hype run fam in Cagayan de Oro City!</h2>
              <p className='text-lg sm:text-xl'>We're more than a run club - we're a growing community built on movement, support, and solid weekly vibes.</p>
            </div>
            <div className="min-w-2 min-h-2 rounded-2xl bg-black/30 sm:flex-2 p-4 text-white">
              <p className="inline-flex items-center w-fit bg-primary font-bold px-2 py-2 rounded-t-md mb-0.5 text-black">NEW EVENT</p>
              <img src={LaborDay} alt="Time Trial Event" className="rounded-tr-md rounded-br-md rounded-bl-md"/>
            </div>
          </div>
        </div>
        <div className='w-full bg-amber-300'>
          <h1>Hello world</h1>
        </div>
      </div>
    </>
  );
}

export default Home;
