export type PartnerLogo = {
    src: string;
    alt: string;
    href: string;
};

export type PartnerCarouselProps = {
    partners: PartnerLogo[];
    className?: string;
    /**
   * Choose how logos are displayed inside each item:
   * - "fit" (default): padded box with white background and object-contain
   * - "fill": edge-to-edge with no background, object-cover
   */
    variant?: "fit" | "fill";
};