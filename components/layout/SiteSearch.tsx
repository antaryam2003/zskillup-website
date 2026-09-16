"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { faqs } from "@/content/faqs";
import { Icon } from "@/components/ui/Icon";

/**
 * The search control shown at the top right of the approved comp.
 *
 * Everything it searches lives on this page today, so it is an in-page finder:
 * it matches section names, offerings and FAQ questions, and jumps to the match.
 * Once the dedicated pages ship, extend `TARGETS` with their routes and the same
 * component keeps working.
 *
 * It is a real control, not decoration - listbox semantics, keyboard navigation
 * and Escape to dismiss.
 */

type Target = { label: string; hint: string; href: string };

const SECTION_TARGETS: Target[] = [
  { label: "For Institutions", hint: "Build a placement-ready campus", href: "#institutions" },
  { label: "Prephasz", hint: "Placement preparation platform", href: "#prephasz" },
  { label: "B.Com + ACCA", hint: "Commerce career pathway", href: "#bcom-acca" },
  { label: "About ZSkillup", hint: "Mission, vision and leadership", href: "#about" },
  { label: "Choose Your Route", hint: "Find the path that fits you", href: "#choose-your-route" },
  { label: "The Education-to-Career Path", hint: "How readiness is built", href: "#education-to-career" },
  { label: "Our Partners", hint: "Institutions and hiring network", href: "#partners" },
  { label: "Testimonials", hint: "Real people. Real progress.", href: "#testimonials" },
  { label: "ZSkillup in Action", hint: "Events and moments", href: "#in-action" },
  { label: "Insights", hint: "Education and career content", href: "/insights" },
  { label: "Partner With Us", hint: "Talk to the ZSkillup team", href: "#partner-with-us" },
];

const TARGETS: Target[] = [
  ...SECTION_TARGETS,
  ...faqs.map((f) => ({ label: f.q, hint: "FAQ", href: "#faqs" })),
];

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTION_TARGETS.slice(0, 6);
    return TARGETS.filter(
      (t) => t.label.toLowerCase().includes(q) || t.hint.toLowerCase().includes(q),
    ).slice(0, 7);
  }, [query]);

  // Focus only. Resetting the query lives in `toggle`, so this effect never
  // schedules state of its own.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const toggle = () => {
    setOpen((wasOpen) => {
      if (wasOpen) {
        setQuery("");
        setActive(0);
      }
      return !wasOpen;
    });
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = href;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].href);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close search" : "Search this site"}
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy transition-colors hover:border-navy/30 hover:bg-cloud"
      >
        <Icon name={open ? "close" : "search"} className="h-[1.05rem] w-[1.05rem]" />
      </button>

      {open ? (
        <div className="absolute top-12 right-0 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-card border border-line bg-white shadow-lift">
          <div className="flex items-center gap-2 border-b border-line-soft px-4">
            <Icon name="search" className="h-4 w-4 shrink-0 text-muted" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search ZSkillup"
              aria-label="Search ZSkillup"
              aria-controls="site-search-results"
              className="w-full bg-transparent py-3.5 text-[0.9375rem] text-navy outline-none"
            />
          </div>

          <ul id="site-search-results" role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto py-2">
            {results.length === 0 ? (
              <li className="px-4 py-3 text-[0.875rem] text-muted">
                Nothing matched &ldquo;{query}&rdquo;.
              </li>
            ) : (
              results.map((r, i) => (
                <li key={`${r.href}-${r.label}`} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                    className={`flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left transition-colors ${
                      i === active ? "bg-cloud" : ""
                    }`}
                  >
                    <span className="text-[0.9375rem] font-semibold text-navy">{r.label}</span>
                    <span className="text-[0.8125rem] text-muted">{r.hint}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
