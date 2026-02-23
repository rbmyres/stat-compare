"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const NAV_LINKS: NavItem[] = [
  {
    href: "/players",
    label: "Players",
    children: [
      { href: "/players/passing", label: "Passing" },
      { href: "/players/rushing", label: "Rushing" },
      { href: "/players/receiving", label: "Receiving" },
      { href: "/players/totals", label: "Totals" },
    ],
  },
  {
    href: "/teams",
    label: "Teams",
    children: [
      { href: "/teams/passing", label: "Passing" },
      { href: "/teams/rushing", label: "Rushing" },
      { href: "/teams/total", label: "Total" },
      { href: "/teams/situational", label: "Situational" },
    ],
  },
  { href: "/compare", label: "Compare" },
  { href: "/graph", label: "Graph" },
  { href: "/dictionary", label: "Dictionary" },
];

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

function NavDropdown({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="group relative">
      <Link
        href={item.href}
        className={cn(
          "relative flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium tracking-wide uppercase transition-colors duration-150",
          isActive ? "text-white" : "text-white/50 hover:text-white/80"
        )}
      >
        {item.label}
        <svg
          className="h-3 w-3 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        {isActive && (
          <span className="absolute inset-x-1 -bottom-[13px] h-[2px] bg-nfl-red" />
        )}
      </Link>

      {/* Dropdown panel */}
      <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
        <div className="min-w-[140px] rounded-md border border-white/10 bg-[#013369] py-1 shadow-lg">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "block px-4 py-2 text-[12px] font-medium tracking-wide transition-colors",
                pathname === child.href
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
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
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

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
            {NAV_LINKS.map((link) =>
              link.children ? (
                <NavDropdown
                  key={link.href}
                  item={link}
                  isActive={pathname.startsWith(link.href)}
                />
              ) : (
                <NavLink
                  key={link.href}
                  href={link.href}
                  isActive={pathname.startsWith(link.href)}
                >
                  {link.label}
                </NavLink>
              )
            )}
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
          mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mx-auto max-w-7xl space-y-1 px-4 pb-4 pt-3">
          <div className="pb-3">
            <SearchBar onNavigate={() => setMobileOpen(false)} />
          </div>
          <div className="border-t border-white/[0.06] pt-2">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.href}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedMobile(
                        expandedMobile === link.label ? null : link.label
                      )
                    }
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium tracking-wide transition-colors duration-150",
                      pathname.startsWith(link.href)
                        ? "text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white/90"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {pathname.startsWith(link.href) && (
                        <span className="h-4 w-[2px] rounded-full bg-nfl-red" />
                      )}
                      {link.label}
                    </span>
                    <svg
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        expandedMobile === link.label && "rotate-180"
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      expandedMobile === link.label
                        ? "max-h-[200px] opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-6 space-y-0.5 pb-1">
                      {link.children.map((child) => (
                        <MobileNavLink
                          key={child.href}
                          href={child.href}
                          isActive={pathname === child.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </MobileNavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <MobileNavLink
                  key={link.href}
                  href={link.href}
                  isActive={pathname.startsWith(link.href)}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </MobileNavLink>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
