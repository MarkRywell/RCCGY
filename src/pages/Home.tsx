
// import LaborDay from '../assets/images/events/labor-day.jpg';
import { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import ImageCarousel from '../components/ImageCarousel';
import InViewAnimate from '../components/InViewAnimate';
import { FaPersonRunning } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { LiaCalendarDaySolid } from "react-icons/lia";
import { homeImages } from '../assets/data/photos';
import { api } from '../lib/supabase';
import type { Event } from '../types/events';
import { FALLBACK_EVENT_IMAGE } from '../lib/constants';


function Home() {
  const [upcoming, setUpcoming] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const data = await api.getUpcomingEvent(false);
      if (!isMounted) return;
      if (!data) {
        setUpcoming(null);
        setError(null);
        setLoading(false);
        return;
      }
      setUpcoming(data as Event);
      setError(null);
      setLoading(false);
    };
    load().catch((err) => {
      if (!isMounted) return;
      console.error('Error loading upcoming event:', err);
      setError('Failed to load upcoming event');
      setUpcoming(null);
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const photo = upcoming?.photo_url || FALLBACK_EVENT_IMAGE;
  const title = upcoming?.name || 'Coming Soon';
  const date = upcoming?.event_date ? new Date(upcoming.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : null;

  return (
    <>
      <div className="min-h-screen w-full flex flex-col">
        <div className="relative h-screen xl:h-screen w-full">
          <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1777566897/rccgy/banner_sta52t.jpg" alt="RANNN Crew banner" className="absolute inset-0 h-full w-full object-cover" />

          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          { /* content */}
          <div className='relative h-full z-10 flex flex-col sm:flex-row justify-between sm:items-center px-10 py-10 gap-5 sm:px-20 sm:py-10 sm:gap-5 xl:gap-40'>
            <div className='flex flex-col gap-4 text-white sm:flex-3 xl:justify-start xl:items-start animate-hero-enter'>
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold">
                  Rannn <span className="text-secondary">Crew</span> CGY
                </h1>
                <h2 className='text-2xl xl:font-bold font-serif'><span className="text-secondary normal">runnr</span><span className='italic'>club</span></h2>
              </div>

              <h2 className='text-3xl sm:text-4xl font-semibold'>Your hype run fam in Cagayan de Oro City!</h2>
              <p className='text-lg sm:text-xl'>We're more than a run club - we're a growing community built on movement, support, and solid weekly vibes.</p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSe4EMt3eUE7S50xB0X57kfmOndxFNcy0HVOppbhKCowJdkcQg/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-fit bg-secondary text-black font-bold px-4 py-2 rounded-md mt-2 transition-all duration-200 hover:scale-105 hover:text-white"
              >
                Join Our Club
              </a>
            </div>
            {(!loading && upcoming) && (
              <div className="w-full sm:flex-none sm:max-w-sm xl:max-w-md md:max-w-72 rounded-2xl overflow-hidden bg-black/30 p-4 text-white animate-hero-enter-right">
                <p className="inline-flex items-center w-fit bg-secondary font-bold px-2 py-2 rounded-t-md mb-0.5 text-black">NEW EVENT</p>
                <div className="flex flex-col gap-2">
                  <div className="relative w-full">
                    <div className="absolute inset-0 bg-black/30" />
                    <img src={photo} alt={title} className="block w-full xs:h-70 md:h-72 rounded-tr-md rounded-br-md rounded-bl-md object-cover" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold">{title}</p>
                    {date && <p className="text-sm text-gray-200">{date}</p>}
                    {error && <p className="text-sm text-red-300">{error}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* stats section */}
        <div className='w-full bg-dark flex items-center justify-center px-10 sm:px-20 py-10'>
          <StatsCard icon={<IoIosPeople />} title="ACTIVE RUNNERS" value={400} unit="+" animate />
          <StatsCard icon={<LiaCalendarDaySolid />} title="RUNNING EVENTS" value={3} unit="/wk" animate />
          <StatsCard icon={<FaPersonRunning />} title="WEEKLY KILOMETERS RUN" value={30} unit="km" animate />
        </div>

        { /* about us section */}
        <div className='w-full bg-gray-800 flex flex-col px-10 sm:px-20 py-10 gap-5 text-white'>
          <InViewAnimate enterClassName="animate-hero-enter" initialClassName="opacity-0 translate-x-6">
            <h3 className='text-left font-bold text-primary'>ABOUT US</h3>
            <h1 className='text-2xl sm:text-3xl font-bold'>WELCOME TO RANNN CREW CGY!</h1>
            <p>Welcome to our community! We are dedicated to fostering a supportive and energetic environment for runners of all levels. Join us and be part of our growing family.</p>
          </InViewAnimate>
          
          { /* images */}
          <InViewAnimate enterClassName="animate-hero-enter-right" initialClassName="opacity-0 -translate-x-6 sm:translate-x-6">
            <ImageCarousel images={homeImages} intervalMs={3500} />
          </InViewAnimate>
        </div>
      </div>
    </>
  );
}

export default Home;
