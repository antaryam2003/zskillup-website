"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { institutions } from "@/content/homepage";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * The large rounded panel under the "For Institutions" hero: two tabs,
 * "Programs for Your Campus" (default) and "Partnership Support".
 *
 * - Programs tab: the six programs, 3 x 2 on desktop, 2 columns on tablet.
 * - Partnership tab: the four `institutions.pillars` - the SAME cards that used
 *   to sit alone under "One partnership". They live here only; nothing else on
 *   the page renders them.
 *
 * Both panels are always in the DOM and the inactive one is `hidden`, so the
 * content stays crawlable and there is no mount/unmount flash on switching.
 * Standard WAI-ARIA tabs pattern: roving tabindex, Left/Right/Home/End.
 *
 * `id="institution-programs"` is the target of the hero's "Explore Solutions"
 * button, so it stays on the panel's outer wrapper.
 */

type TabKey = "programs" | "partnership";

const TABS: { key: TabKey; label: string }[] = [
  { key: "programs", label: institutions.tabs.programs },
  { key: "partnership", label: institutions.tabs.partnership },
];

const programIcons: IconName[] = ["chart", "message", "code", "layers", "database", "users"];
const programWells = [
  "bg-[#ece5fb] text-inst",
  "bg-[#fde7ea] text-[#d6304f]",
  "bg-[#dcf2ec] text-com",
  "bg-[#fde7ea] text-[#d6304f]",
  "bg-[#dbeafe] text-[#2a56b8]",
  "bg-[#ece5fb] text-inst",
];

const pillarIcons: IconName[] = ["graduation", "file", "bulb", "users"];
// Same lavender / rose alternation the pillar cards always had.
const pillarWells = [
  "bg-[#ece5fb] text-inst",
  "bg-[#fde7ea] text-[#d6304f]",
  "bg-[#ece5fb] text-inst",
  "bg-[#fde7ea] text-[#d6304f]",
];

const cardClass =
  "h-full rounded-2xl border border-[#ebe7f6] bg-white shadow-[0_1px_2px_rgba(60,40,120,0.04)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift";

export function InstitutionsTabs() {
  const uid = useId();
  const [active, setActive] = useState<TabKey>("programs");
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    programs: null,
    partnership: null,
  });

  const select = (key: TabKey, focus = false) => {
    setActive(key);
    if (focus) tabRefs.current[key]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    if (next === null) return;
    event.preventDefault();
    select(TABS[next].key, true);
  };

  const tabId = (key: TabKey) => `${uid}-tab-${key}`;
  const panelId = (key: TabKey) => `${uid}-panel-${key}`;

  return (
    <div
      id="institution-programs"
      className="scroll-mt-24 overflow-hidden rounded-[1.5rem] border border-[#ece8f7] bg-white shadow-[0_1px_2px_rgba(60,40,120,0.04),0_24px_60px_-28px_rgba(60,40,120,0.22)] sm:rounded-[1.75rem]"
    >
      <div
        role="tablist"
        aria-label="Institution offerings"
        className="flex border-b border-[#ece8f7] px-2 sm:px-6"
      >
        {TABS.map((tab, i) => {
          const selected = active === tab.key;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              type="button"
              role="tab"
              id={tabId(tab.key)}
              aria-selected={selected}
              aria-controls={panelId(tab.key)}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`relative flex-1 px-3 py-4 text-center text-[0.9375rem] leading-snug transition-colors duration-200 sm:flex-none sm:px-8 sm:py-5 sm:text-[1.1875rem] sm:whitespace-nowrap ${
                selected ? "font-semibold text-inst" : "font-medium text-muted hover:text-navy"
              }`}
            >
              {tab.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-inst transition-opacity duration-200 ${
                  selected ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* --- Programs for Your Campus ------------------------------------- */}
      <div
        role="tabpanel"
        id={panelId("programs")}
        aria-labelledby={tabId("programs")}
        hidden={active !== "programs"}
        className="p-4 sm:p-6"
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {institutions.programs.map((program, i) => (
            <li key={program.name}>
              <div className={`flex gap-4 p-4 sm:p-5 ${cardClass}`}>
                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${programWells[i]}`}
                >
                  <Icon name={programIcons[i]} className="h-7 w-7" />
                </span>
                <div className="min-w-0">
                  <h4 className="text-[1rem] leading-snug font-bold text-navy sm:text-[1.0625rem]">
                    {program.name}
                  </h4>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-muted sm:text-[0.9375rem]">
                    {program.focus}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Partnership Support: the four former "One partnership" cards --- */}
      <div
        role="tabpanel"
        id={panelId("partnership")}
        aria-labelledby={tabId("partnership")}
        hidden={active !== "partnership"}
        className="p-4 sm:p-6"
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {institutions.pillars.map((pillar, i) => (
            <li key={pillar.title}>
              <div className={`p-5 sm:p-6 ${cardClass}`}>
                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl ${pillarWells[i]}`}
                >
                  <Icon name={pillarIcons[i]} className="h-7 w-7" />
                </span>
                <h4 className="mt-5 text-[1.0625rem] leading-snug font-bold text-navy">
                  {pillar.title}
                </h4>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-muted sm:text-[0.9375rem]">
                  {pillar.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
