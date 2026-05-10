export type PartnerLogo = {
  src: string;
  alt: string;
  href: string;
};

type PartnerCarouselProps = {
  partners: PartnerLogo[];
  className?: string;
};

function PartnerCarousel({ partners, className }: PartnerCarouselProps) {
  if (!partners.length) return null;

  // Duplicate the partner set multiple times so the visible width remains covered
  // even at the midpoint of the translation (prevents right-side gap on loop reset).
  const scrollingPartners = [...partners, ...partners, ...partners];

  return (
    <div
      className={`w-full overflow-hidden py-4 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className ?? ""}`}
      aria-label="Partner logos carousel"
    >
      <div className="flex w-max gap-4 animate-[partner-scroll_24s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
        {scrollingPartners.map((partner, index) => (
          <a
            key={`${partner.alt}-${index}`}
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${partner.alt}`}
            className="group flex h-24 w-52 shrink-0 items-center justify-center rounded-lg bg-white p-4 shadow-md transition-transform duration-300 ease-out hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
          >
            <img
              src={partner.src}
              alt={partner.alt}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export default PartnerCarousel;
