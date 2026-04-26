import BannerImage from '../assets/images/banner.jpg';


function Home() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col">
        <div className="relative h-[70vh] w-full">
          <img src={BannerImage} alt="RANNN Crew banner" className="absolute inset-0 h-full w-full object-cover" />

          {/* optional dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          <div className='relative z-10 flex justify-between items-center p-20'>
            <h1 className='text-4xl font-bold text-white'>RANNN Crew</h1>
            <div className="min-w-2 min-h-2 rounded-2xl bg-white">
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
