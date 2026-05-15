import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import useInViewAnimation from "../lib/useInViewAnimation";

function mergeClasses(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

type InViewAnimateProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  enterClassName: string;
  initialClassName?: string;
  className?: string;
  threshold?: IntersectionObserverInit["threshold"];
  rootMargin?: IntersectionObserverInit["rootMargin"];
  once?: boolean;
} & Omit<ComponentPropsWithRef<T>, "as" | "children" | "className">;

/**
 * Declarative wrapper to apply enter animations when an element comes into view.
 */
function InViewAnimate<T extends ElementType = "div">({
  as,
  children,
  enterClassName,
  initialClassName = "opacity-0 translate-y-4",
  className,
  threshold,
  rootMargin,
  once,
  ...rest
}: InViewAnimateProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const { ref, inView } = useInViewAnimation({ threshold, rootMargin, once });

  const statefulClass = inView ? enterClassName : initialClassName;

  return (
    <Component
      ref={ref}
      className={mergeClasses(className, statefulClass)}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default InViewAnimate;
