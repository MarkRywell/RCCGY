export type PartnerLogo = {
  src: string;
  alt: string;
  href: string;
};

type PartnerCarouselProps = {
  partners: PartnerLogo[];
  className?: string;
  /**
   * Choose how logos are displayed inside each item:
   * - "fit" (default): padded box with white background and object-contain
   * - "fill": edge-to-edge with no background, object-cover
   */
  variant?: "fit" | "fill";
};

function PartnerCarousel({ partners, className, variant = "fit" }: PartnerCarouselProps) {
  if (!partners.length) return null;

  // Duplicate the partner set multiple times so the visible width remains covered
  // even at the midpoint of the translation (prevents right-side gap on loop reset).
  const scrollingPartners = [...partners, ...partners, ...partners, ...partners];

  const isFill = variant === "fill";
  // Scale duration with partner count to keep a steady pixel speed as items grow.
  const durationSeconds = (24 * Math.max(partners.length, 1)) / 3;

  return (
    <div
      className={`w-full overflow-hidden py-4 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className ?? ""}`}
      aria-label="Partner logos carousel"
    >
      <div
        className="flex w-max gap-4 animate-[partner-scroll_24s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {scrollingPartners.map((partner, index) => (
          <a
            key={`${partner.alt}-${index}`}
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${partner.alt}`}
            className={`group flex w-30 md:w-45 lg:w-52 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 ease-out hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 ${
              isFill ? "bg-transparent p-0 shadow-none h-30 lg:h-52" : "bg-white p-4 shadow-md w-30 md:w-45 md:h-24 lg:w-52 lg:h-24"
            }`}
          >
            <img
              src={partner.src}
              alt={partner.alt}
              loading="lazy" 
              className={`h-full w-full transition-transform duration-300 ease-out group-hover:scale-105 ${
                isFill ? "object-cover rounded-lg" : "object-contain"
              }`}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export default PartnerCarousel;
