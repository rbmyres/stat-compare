"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
      { href: "/players/overview", label: "Overview" },
    ],
  },
  {
    href: "/teams",
    label: "Teams",
    children: [
      { href: "/teams/passing", label: "Passing" },
      { href: "/teams/rushing", label: "Rushing" },
      { href: "/teams/overview", label: "Overview" },
      { href: "/teams/situational", label: "Situational" },
    ],
  },
  { href: "/compare", label: "Compare" },
  { href: "/glossary", label: "Glossary" },
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
        <span className="absolute inset-x-1 -bottom-[13px] h-[2px] bg-white" />
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
  const [open, setOpen] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={item.href}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter") {
            e.preventDefault();
            setOpen(true);
            // Focus the first dropdown link
            const first = e.currentTarget
              .closest(".group")
              ?.querySelector<HTMLAnchorElement>("[data-dropdown-item]");
            first?.focus();
          }
        }}
        className={cn(
          "relative flex cursor-pointer items-center gap-1 px-3 py-1.5 text-[13px] font-medium tracking-wide uppercase transition-colors duration-150",
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
          <span className="absolute inset-x-1 -bottom-[13px] h-[2px] bg-white" />
        )}
      </Link>

      {/* Dropdown panel */}
      <div
        className={cn(
          "absolute left-0 top-full pt-2 transition-all duration-150",
          open
            ? "visible opacity-100"
            : "invisible opacity-0 group-hover:visible group-hover:opacity-100"
        )}
      >
        <div
          className="min-w-[140px] rounded-md border border-white/10 bg-nfl-navy py-1 shadow-lg"
          role="menu"
        >
          {item.children!.map((child, i) => (
            <Link
              key={child.href}
              href={child.href}
              data-dropdown-item
              role="menuitem"
              onBlur={(e) => {
                // Close dropdown when focus leaves the last item
                if (i === item.children!.length - 1 && !e.currentTarget.closest(".group")?.contains(e.relatedTarget as Node)) {
                  setOpen(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
                } else if (e.key === "Escape") {
                  setOpen(false);
                  e.currentTarget.closest(".group")?.querySelector<HTMLAnchorElement>("a")?.focus();
                }
              }}
              className={cn(
                "block px-4 py-2 text-[12px] font-medium tracking-wide transition-colors",
                pathname === child.href
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white focus:outline-none"
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
        <span className="h-4 w-[2px] rounded-full bg-white" />
      )}
      {children}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      // Focus first focusable element in menu
      const first = mobileMenuRef.current?.querySelector<HTMLElement>(
        "input, a, button"
      );
      first?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeMobile();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobile]);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-nfl-navy">
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
            ref={hamburgerRef}
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative ml-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/10 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
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
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-label="Navigation menu"
        className={cn(
          "overflow-hidden border-t border-white/[0.06] transition-all duration-200 ease-out lg:hidden",
          mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mx-auto max-w-7xl space-y-1 px-4 pb-4 pt-3">
          <div className="pb-3">
            <SearchBar onNavigate={closeMobile} />
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
                      "flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium tracking-wide transition-colors duration-150",
                      pathname.startsWith(link.href)
                        ? "text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white/90"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {pathname.startsWith(link.href) && (
                        <span className="h-4 w-[2px] rounded-full bg-white" />
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
                          onClick={closeMobile}
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
