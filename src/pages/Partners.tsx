import PartnerCarousel from "../components/PartnerCarousel";
import { globalPartners, localPartners } from "../assets/data/photos";


function Partners() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col bg-gray-800 text-white">
        
        <div className="relative w-full overflow-hidden p-10 md:p-15">
          <img src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778573747/rccgy/merch2_yn08pd.jpg" alt="Merch" className="absolute inset-0 h-full w-full object-cover object-[50%_80%]" />
        
          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
        

          { /* content */ }
          <div className="relative h-full z-10 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-bold mb-10">OUR PARTNERS</h1>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-start p-5 sm:p-10">
          <div className="w-full my-5">
            <h2 className="text-2xl font-bold mb-10 text-center">GLOBAL PARTNERS</h2>

            <PartnerCarousel partners={globalPartners} />
          </div>

          <div className="w-full my-5">
            <h2 className="text-2xl font-bold mb-10 text-center">LOCAL PARTNERS</h2>

            <PartnerCarousel partners={localPartners} variant="fill" />
          </div>
        </div>
    
      </div>
    </>
  );
}

export default Partners;
