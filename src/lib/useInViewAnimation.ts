import { useEffect, useRef, useState } from "react";

type UseInViewAnimationOptions = {
  threshold?: IntersectionObserverInit["threshold"];
  rootMargin?: IntersectionObserverInit["rootMargin"];
  /**
   * When true, once an element has intersected it stays visible and the observer unobserves it.
   * When false, visibility toggles as the element enters/leaves the viewport.
   */
  once?: boolean;
};

/**
 * Lightweight IntersectionObserver helper to drive enter animations.
 * Defaults to a 25% visibility threshold and single-fire behavior.
 */
export function useInViewAnimation({
  threshold = 0.25,
  rootMargin = "0px",
  once = true,
}: UseInViewAnimationOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(() => {
    if (typeof window === "undefined") return false;
    if (!("IntersectionObserver" in window)) return true; // fallback: mark visible on browsers without IO
    return false;
  });

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    // No-op when IO isn't available; initial state handled above.
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isIntersecting = Boolean(entry?.isIntersecting);

        if (isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView } as const;
}

export default useInViewAnimation;
