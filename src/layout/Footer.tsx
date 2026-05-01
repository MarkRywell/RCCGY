import { Link } from 'react-router';


function Footer() {
  return (
    <>
      <footer className="bg-dark w-full flex flex-col pb-2 pt-4 px-10 md:px-20 lg:px-30 xl:px-40 relative bottom-0 text-white">
        <div className="flex-4 flex flex-col sm:flex-row items-start justify-left gap-5 py-5">
          <div className="flex flex-col flex-2">
            <div className="flex flex-col justify-left gap-5">
              <Link
                to="/"
                className="flex gap-2 items-center flex-2 group cursor-pointer"
              >
                <h1 className="text-2xl sm:text-3xl font-bold cursor-pointer transition-all duration-200 hover:text-primary hover:scale-105">
                  RCCGY
                </h1>
              </Link>
              <p className=''>Fast or slow, we go. RCCGY: <br /> For the Undeterred.</p>
            </div>
          </div>

          <div className='flex flex-col flex-1 gap-2'>
            <h2 className='sm:text-lg font-bold'>QUICK LINKS</h2>
            <Link to="/about" className='text-sm md:text-base transition-all duration-200 hover:text-primary hover:scale-105 cursor-pointer origin-top-left'>About Us</Link>
            <Link to="/events" className='text-sm md:text-base transition-all duration-200 hover:text-primary hover:scale-105 cursor-pointer origin-top-left'>Events</Link>
            <Link to="/partners" className='text-sm md:text-base transition-all duration-200 hover:text-primary hover:scale-105 cursor-pointer origin-top-left'>Partners</Link>
            <Link to="/contact" className='text-sm md:text-base transition-all duration-200 hover:text-primary hover:scale-105 cursor-pointer origin-top-left'>Contact Us</Link>
          </div>

          <div className='h-full flex flex-col flex-1 gap-2 justify-start'>
            <h2 className='sm:text-lg font-bold'>CONNECT WITH US</h2>
            <a href="https://www.facebook.com/profile.php?id=61565994238694" target="_blank" rel="noopener noreferrer" className='text-sm md:text-base transition-all duration-200 hover:text-primary hover:scale-105 cursor-pointer origin-top-left'>Facebook</a>
            <a href="https://www.instagram.com/rannnccgy" target="_blank" rel="noopener noreferrer" className='text-sm md:text-base transition-all duration-200 hover:text-primary hover:scale-105 cursor-pointer origin-top-left'>Instagram</a>
            <a href="mailto:rannncrewcgy@gmail.com" className='text-sm md:text-base transition-all duration-200 hover:text-primary hover:scale-105 cursor-pointer origin-top-left'>Gmail</a>
          </div>
        </div>
        <p className="text-center text-sm border-t border-t-gray-100 pt-1 font-semibold">
          &copy; 2026 Rannn Crew CGY. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default Footer;
