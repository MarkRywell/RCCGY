import PartnerCarousel from "../components/PartnerCarousel";
import { globalPartners, localPartners } from "../assets/data/partners";


function Partners() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center justify-start p-5 sm:p-10 bg-gray-800 text-white">
        <h1 className="text-4xl font-bold mb-10">OUR PARTNERS</h1>

        <div className="w-full my-10">
          <h2 className="text-2xl font-bold mb-10 text-center">GLOBAL PARTNERS</h2>

          <PartnerCarousel partners={globalPartners} />
        </div>

        <div className="w-full my-10">
          <h2 className="text-2xl font-bold mb-10 text-center">LOCAL PARTNERS</h2>

          <PartnerCarousel partners={localPartners} variant="fill" />
        </div>
    
      </div>
    </>
  );
}

export default Partners;
