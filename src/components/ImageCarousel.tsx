import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GalleryImage from "./GalleryImage";

export type CarouselImage = {
  src: string;
  alt: string;
};

type ImageCarouselProps = {
  images: CarouselImage[];
  /** autoplay interval in ms. Set to 0 / undefined to disable. */
  intervalMs?: number;
  className?: string;
};

function ImageCarousel({ images, intervalMs = 2500, className }: ImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const hasReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      console.debug("[ImageCarousel] scrollToIndex", { index, hasReducedMotion });

      const container = containerRef.current;
      if (!container) return;

      const child = container.children.item(index) as HTMLElement | null;
      if (!child) return;

      // IMPORTANT:
      // Avoid `element.scrollIntoView()` here because it can scroll the entire page
      // to make the carousel visible (which causes the Home page to jump down).
      // We only want to scroll the carousel container horizontally.
      container.scrollTo({
        left: child.offsetLeft,
        behavior: hasReducedMotion ? "auto" : "smooth",
      });
    },
    [hasReducedMotion]
  );

  // Track visibility so autoplay doesn't run while the user is still reading other sections.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // If IntersectionObserver isn't available, default to visible so existing behavior works.
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // eslint-disable-next-line
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(Boolean(entry?.isIntersecting));
      },
      {
        // Consider it visible when at least 25% of the carousel is in the viewport.
        threshold: 0.25,
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Autoplay
  useEffect(() => {
    console.debug("[ImageCarousel] autoplay effect eval", {
      imagesLength: images.length,
      intervalMs,
      isPaused,
      isVisible,
      hasReducedMotion,
    });

    if (!images.length) return;
    if (!intervalMs || intervalMs <= 0) return;
    if (isPaused) return;
    if (!isVisible) return;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % images.length;
        scrollToIndex(next);
        return next;
      });
    }, intervalMs);

    console.debug("[ImageCarousel] autoplay interval started", { intervalMs });

    return () => {
      console.debug("[ImageCarousel] autoplay interval cleared", { intervalMs });
      window.clearInterval(id);
    };
  }, [images.length, intervalMs, isPaused, isVisible, scrollToIndex, hasReducedMotion]);

  if (!images.length) return null;

  return (
    <div className={className}>
      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className={
          "flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory " +
          "pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        }
        aria-label="Image carousel"
      >
        {images.map((img, idx) => (
          <div
            key={`${img.src}-${idx}`}
            className="shrink-0 snap-start w-[80%] sm:w-65 md:w-75 lg:w-90 xl:w-96"
          >
            <div className="w-full h-50 lg:h-70 xl:h-90">
              <GalleryImage src={img.src} alt={img.alt} />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setActiveIndex(idx);
              scrollToIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className={
              "h-2.5 rounded-full transition-all " +
              (idx === activeIndex ? "w-6 bg-primary" : "w-2.5 bg-white/30 hover:bg-white/50")
            }
          />
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;
