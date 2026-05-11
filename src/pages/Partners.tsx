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

const localPartners: PartnerLogo[] = [
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418299/rccgy/sponsors/fliq-athletics_whpcsd.jpg",
    alt: "Fliq Athletics",
    href: "https://www.fliqathletics.com/",
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418300/rccgy/sponsors/lift-athletics_dznab9.jpg",
    alt: "Lift Athletics",
    href: "https://liftathleticscdo.com/"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418300/rccgy/sponsors/phyx_xteaka.jpg",
    alt: "Phyx Rehab Physiotherapy Services",
    href: "https://www.facebook.com/phyxrehab"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418299/rccgy/sponsors/aid-station_o1gnmn.jpg",
    alt: "Aid Station",
    href: "https://www.facebook.com/profile.php?id=61573099223787"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418301/rccgy/sponsors/ora_qkgead.jpg",
    alt: "Ora Wellness and Recovery",
    href: "https://www.facebook.com/ora.cgy"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418299/rccgy/sponsors/analog-grit_cltajr.jpg",
    alt: "Analog Grit",
    href: "https://www.facebook.com/analoggrit"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418301/rccgy/sponsors/salakol_jv3dl6.jpg",
    alt: "Salakolens",
    href: "https://www.facebook.com/salakolens"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418300/rccgy/sponsors/Purp_mhvboq.jpg",
    alt: "Purp Premium Shoe Care",
    href: "https://www.facebook.com/purppremiumshoecare"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418299/rccgy/sponsors/devils-empanada_hqzflj.jpg",
    alt: "Devil's Empanada",
    href: "https://www.facebook.com/Yugybalageer"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418301/rccgy/sponsors/stibs-house_zodl2q.jpg",
    alt: "Stib's House",
    href: "https://www.facebook.com/Stibshousecdo"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418300/rccgy/sponsors/nenecitas_vuomma.jpg",
    alt: "Nenecitas Sorbetes",
    href: "https://www.facebook.com/TheFilipinoIceCream"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418300/rccgy/sponsors/flr_vdbq4e.jpg",
    alt: "FLTR. Coffee",
    href: "https://www.facebook.com/fltrcoffeeclub"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418301/rccgy/sponsors/SRI_s62n5x.jpg",
    alt: "SRI Events",
    href: "https://www.facebook.com/profile.php?id=61570376210089"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418299/rccgy/sponsors/Amlan_wspfoa.jpg",
    alt: "AMLAN Purified Water",
    href: "https://www.facebook.com/amlanph"
  },
  {
    src: "https://res.cloudinary.com/di8bd6f96/image/upload/v1778418300/rccgy/sponsors/roda_vcljpb.jpg",
    alt: "Roda Fastfood",
    href: "https://www.facebook.com/RodaFastfood"
  },
]

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
