import BannerImage from '../assets/images/banner.jpg';


function Home() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col">
        <div className="relative h-[70vh] w-full">
          <img src={BannerImage} alt="RANNN Crew banner" className="absolute inset-0 h-full w-full object-cover" />

          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          <div className='relative z-10 flex justify-between items-center px-20 py-40 gap-5 sm:flex-row'>
            <div className='flex flex-col gap-4 text-white flex-3'>
              <h1 className='text-4xl font-bold'>Your hype run fam in Cagayan de Oro City!</h1>
              <p className='text-2xl'>We're more than a run club - we're a growing community built on movement, support, and solid weekly vibes.</p>
            </div>
            <div className="min-w-2 min-h-2 rounded-2xl bg-white flex-2">
              Join Us
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
