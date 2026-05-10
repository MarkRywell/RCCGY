import PartnerCarousel, { type PartnerLogo } from "../components/PartnerCarousel";

const globalPartners: PartnerLogo[] = [
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1777718209/rccgy/sponsors/runnr_e0mx7w.png",
    alt: "Runnr",
    href: "https://runnr.ph/",
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1777718209/rccgy/sponsors/coros_mc3qqx.png",
    alt: "Coros",
    href: "https://coros.com/",
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1777862923/rccgy/sponsors/Gu_at2uk8.webp",
    alt: "Gu Energy Gel",
    href: "https://guenergy.com/",
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1777718210/rccgy/sponsors/Brooks_p7n02x.jpg",
    alt: "Brooks",
    href: "https://www.brooksrunning.com/",
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1777718209/rccgy/sponsors/Ciele_mpojgd.jpg",
    alt: "Ciele",
    href: "https://www.cieleathletics.com/",
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1777862822/rccgy/sponsors/OOFos_ksvsyu.jpg",
    alt: "OOFos",
    href: "https://www.oofos.com/",
  },
];

function Partners() {
  return (
    <>
      <div className="h-screen w-full flex flex-col items-center justify-start p-5 sm:p-10 bg-gray-800 text-white">
        <h1 className="text-4xl font-bold mb-10">OUR PARTNERS</h1>

        <div className="w-full">
          <h2 className="text-2xl font-bold mb-10 text-center">GLOBAL PARTNERS</h2>

          <PartnerCarousel partners={globalPartners} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-10">LOCAL PARTNERS</h2>
        </div>
    
      </div>
    </>
  );
}

export default Partners;
