"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/players", label: "Players" },
  { href: "/teams", label: "Teams" },
  { href: "/compare", label: "Compare" },
  { href: "/graph", label: "Graph" },
  { href: "/dictionary", label: "Dictionary" },
] as const;

function NavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-3 py-1.5 text-[13px] font-medium tracking-wide uppercase transition-colors duration-150",
        isActive
          ? "text-white"
          : "text-white/50 hover:text-white/80"
      )}
    >
      {children}
      {isActive && (
        <span className="absolute inset-x-1 -bottom-[13px] h-[2px] bg-nfl-red" />
      )}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  isActive,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium tracking-wide transition-colors duration-150",
        isActive
          ? "bg-white/10 text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white/90"
      )}
    >
      {isActive && (
        <span className="h-4 w-[2px] rounded-full bg-nfl-red" />
      )}
      {children}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#013369]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center gap-6">
          {/* Brand */}
          <Link
            href="/"
            className="shrink-0 text-[15px] font-bold tracking-[-0.02em] text-white transition-opacity hover:opacity-80"
          >
            StatCompare
          </Link>

          {/* Desktop search — centered, constrained width */}
          <div className="hidden flex-1 lg:flex lg:justify-center">
            <div className="w-full max-w-sm">
              <SearchBar />
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                isActive={pathname.startsWith(link.href)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative ml-auto flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-white/10 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">
              {mobileOpen ? "Close menu" : "Open menu"}
            </span>
            <span
              className={cn(
                "absolute h-[1.5px] w-4 rounded-full bg-white transition-all duration-200",
                mobileOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-4 rounded-full bg-white transition-all duration-200",
                mobileOpen ? "opacity-0" : "opacity-100"
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-4 rounded-full bg-white transition-all duration-200",
                mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-white/[0.06] transition-all duration-200 ease-out lg:hidden",
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mx-auto max-w-7xl space-y-1 px-4 pb-4 pt-3">
          <div className="pb-3">
            <SearchBar onNavigate={() => setMobileOpen(false)} />
          </div>
          <div className="border-t border-white/[0.06] pt-2">
            {NAV_LINKS.map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                isActive={pathname.startsWith(link.href)}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </MobileNavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
