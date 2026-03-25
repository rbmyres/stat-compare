"use client";

import { useRef, useState, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

interface StatTooltipProps {
  content: string | undefined;
  children: React.ReactNode;
  position?: "top" | "bottom";
}

interface TooltipPos {
  top: number;
  left: number;
  arrowOffset: number;
}

export function StatTooltip({
  content,
  children,
  position = "top",
}: StatTooltipProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<TooltipPos>({ top: 0, left: 0, arrowOffset: 0 });
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const show = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const tooltipWidth = 220;
    const gap = 6;

    // Center horizontally on the trigger
    const left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // Clamp to viewport edges with 8px padding
    const minLeft = 8;
    const maxLeft = window.innerWidth - tooltipWidth - 8;
    const clampedLeft = Math.max(minLeft, Math.min(maxLeft, left));

    // Arrow offset: how far the arrow needs to shift from center to point at trigger
    const arrowOffset = left - clampedLeft;

    const top =
      position === "bottom"
        ? rect.bottom + gap
        : rect.top - gap;

    setPos({ top, left: clampedLeft, arrowOffset });
    setVisible(true);
  }, [position]);

  const hide = useCallback(() => setVisible(false), []);

  if (!content) return <>{children}</>;

  const tooltip = visible && mounted ? (
    <span
      style={{
        position: "fixed",
        top: position === "bottom" ? pos.top : undefined,
        bottom: position === "top" ? window.innerHeight - pos.top : undefined,
        left: pos.left,
        width: "max-content",
        maxWidth: 220,
        zIndex: 9999,
      }}
      className="pointer-events-none rounded-md bg-foreground px-2.5 py-1.5 text-[11px] font-normal normal-case tracking-normal leading-snug text-white shadow-md"
    >
      {content}
      <span
        style={{
          position: "absolute",
          left: `calc(50% + ${pos.arrowOffset}px)`,
          transform: "translateX(-50%)",
        }}
        className={
          position === "bottom"
            ? "-top-2 border-4 border-transparent border-b-foreground"
            : "-bottom-2 border-4 border-transparent border-t-foreground"
        }
      />
    </span>
  ) : null;

  return (
    <span
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onTouchStart={(e) => {
        if (visible) {
          hide();
        } else {
          e.preventDefault();
          show();
        }
      }}
      tabIndex={0}
      className="inline-flex items-center"
    >
      {children}
      {visible && (
        <span className="absolute inset-x-0 -bottom-px border-b border-dashed border-current opacity-40" />
      )}
      {tooltip && createPortal(tooltip, document.body)}
    </span>
  );
}
