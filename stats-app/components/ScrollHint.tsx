"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";

interface ScrollHintProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollHint({ children, className }: ScrollHintProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  return (
    <div className={cn("relative", className)}>
      <div ref={ref} className="overflow-x-auto">
        {children}
      </div>
      {/* Left shadow */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent transition-opacity duration-200",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
      {/* Right shadow */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent transition-opacity duration-200",
          canScrollRight ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
    </div>
  );
}
