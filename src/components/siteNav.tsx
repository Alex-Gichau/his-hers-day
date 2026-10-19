"use client";

import * as React from "react";
import { Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { iconMap } from "@/types/data";
import type { NavData } from "@/types/data";

interface SiteNavProps {
  nav: NavData;
  /** Monogram + name shown in the bar. */
  className?: string;
}

/**
 * Responsive site navigation.
 *
 * Desktop (>= sm): a single bar pinned to the top of the viewport with the
 * brand on the left, inline links in the middle and a CTA on the right.
 *
 * Mobile (< sm): the same links collapse into a fixed bottom bar that sits
 * in the middle of the screen. It is centred horizontally and floats above
 * the content, with a translucent blurred background so the page stays
 * readable behind it.
 */
export function SiteNav({ nav, className }: SiteNavProps) {
  const [active, setActive] = React.useState<string>("");

  // Smooth, offset-aware scrolling for every in-page link. The native
  // `scroll-behavior: smooth` rule handles most of it, but jumping to an
  // anchor on a page where the browser is already animating can feel
  // abrupt, so the scroll is driven explicitly here.
  const handleNavClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const id = href.replace("#", "");
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      setActive(id);

      // Offset the destination by the fixed header so the section title
      // is not hidden underneath it.
      const header = document.querySelector("header");
      const headerHeight =
        header && window.getComputedStyle(header).display !== "none"
          ? header.getBoundingClientRect().height
          : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({ top, behavior: "smooth" });
      window.history.replaceState(null, "", href);
    },
    [],
  );

  // Highlight whichever section is currently in view. A scroll handler is
  // used rather than IntersectionObserver so that short sections (like the
  // RSVP card) are still detected correctly, and so clicking a link
  // immediately highlights the section it navigated to.
  React.useEffect(() => {
    const ids = nav.items
      .map((item) => item.href.replace("#", ""))
      .filter(Boolean);

    const update = () => {
      // The line of sight sits just below the fixed header on desktop.
      const header = document.querySelector("header");
      const offset = (header?.getBoundingClientRect().height ?? 0) + 24;
      const line = offset + 8;

      // Sort by position in the document (not nav order) so the section
      // that is furthest up the page wins the highlight.
      const sections = ids
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return { id, top: el.getBoundingClientRect().top };
        })
        .filter((s): s is { id: string; top: number } => s !== null)
        .sort((a, b) => a.top - b.top);

      let current = "";
      for (const section of sections) {
        if (section.top <= line) current = section.id;
      }

      // If nothing has reached the line yet, fall back to the first section.
      if (!current) current = sections[0]?.id ?? "";

      setActive((prev) => (prev === current ? prev : current));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [nav.items]);

  return (
    <>
      {/* ---------- Desktop: top bar ---------- */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 hidden border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sm:block",
          className,
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            onClick={(event) => handleNavClick(event, "#top")}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            aria-label={nav.brandName}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-wedding text-base text-primary">
              {nav.brand}
            </span>
            <span className="font-wedding text-2xl leading-none text-foreground">
              {nav.brandName}
            </span>
          </a>

          <nav aria-label="Main" className="flex items-center gap-1">
            {nav.items.map((item) => {
              const isActive = active === item.href.replace("#", "");
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <a
            href={nav.ctaHref}
            onClick={(event) => handleNavClick(event, nav.ctaHref)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            {nav.cta}
          </a>
        </div>
      </header>

      {/* ---------- Mobile: floating bottom bar ---------- */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[calc(100vw-1.5rem)] max-w-[26rem] rounded-3xl border border-border/70 bg-background/85 px-1.5 py-1.5 shadow-2xl backdrop-blur-xl sm:hidden"
      >
        <ul className="flex items-center gap-0.5">
          {nav.items.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = active === item.href.replace("#", "");
            return (
              <li key={item.href} className="min-w-0 flex-1">
                <a
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className={cn(
                    "flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground active:bg-accent/70",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  <span className="max-w-full truncate text-[9px] leading-none tracking-wide">
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}

          {/* The desktop bar carries the RSVP as a separate CTA button, so the
              bottom bar needs its own entry to keep RSVP reachable on mobile. */}
          <li className="min-w-0 flex-1">
            <a
              href={nav.ctaHref}
              aria-label={nav.cta}
              aria-current={active === nav.ctaHref.replace("#", "") ? "page" : undefined}
              onClick={(event) => handleNavClick(event, nav.ctaHref)}
              className={cn(
                "flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors",
                active === nav.ctaHref.replace("#", "")
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground active:bg-accent/70",
              )}
            >
              <Mail className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="max-w-full truncate text-[9px] leading-none tracking-wide">
                {nav.cta}
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default SiteNav;
