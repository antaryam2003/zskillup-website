import { PrephaszWordmark } from "@/components/ui/Brand";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * The Prephasz product visual.
 *
 * The brief: "Keep the Prephasz product/dashboard visual on the top right. This
 * is important because users should immediately see that Prephasz is an actual
 * platform, not just another training program."
 *
 * Built in markup rather than shipped as a screenshot, for three reasons:
 *   - it stays crisp at any density and costs a few KB instead of a large PNG;
 *   - it does not flatten copy into an image;
 *   - it is trivially restyled when the real product UI changes.
 *
 * The mock itself is decorative - it illustrates the product rather than carrying
 * meaning - so it is hidden from assistive technology. The play control that sits
 * on top of it is a real, labelled button rendered by the parent.
 *
 * To swap in a real screenshot instead: replace this component's body with a
 * next/image at a 16:10 ratio and keep the wrapper classes.
 */

const sidebar: { label: string; icon: IconName; active?: boolean }[] = [
  { label: "Home", icon: "building", active: true },
  { label: "Practice", icon: "target" },
  { label: "Assessments", icon: "file" },
  { label: "Companies", icon: "briefcase" },
  { label: "Interview Prep", icon: "message" },
  { label: "Resume Builder", icon: "clipboard" },
  { label: "Progress", icon: "trending" },
];

const tiles: { label: string; icon: IconName }[] = [
  { label: "Practice by Topic", icon: "file" },
  { label: "Mock Assessments", icon: "clipboard" },
  { label: "Company Preparation", icon: "building" },
  { label: "Track Progress", icon: "trending" },
];

const progress = [
  { label: "Practice", value: "12/20" },
  { label: "Assessments", value: "8/10" },
  { label: "Companies", value: "3/5" },
];

export function PrephaszDashboard({ media }: { media?: React.ReactNode }) {
  return (
    <div className="flex h-full w-full overflow-hidden rounded-2xl border border-line bg-white text-left">
      {/* Sidebar */}
      <div
        aria-hidden="true"
        className="hidden w-[30%] max-w-[10.5rem] shrink-0 border-r border-line-soft bg-cloud p-3.5 sm:block"
      >
        <PrephaszWordmark className="text-[0.95rem]" />
        <ul className="mt-5 space-y-0.5">
          {sidebar.map((item) => (
            <li
              key={item.label}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[0.6875rem] font-medium ${
                item.active ? "bg-prep-soft text-navy" : "text-muted"
              }`}
            >
              <Icon name={item.icon} className="h-3 w-3 shrink-0" />
              <span className="truncate">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main panel */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div aria-hidden="true" className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.9375rem] font-bold text-navy">Hi, Future Professional</p>
            <p className="mt-0.5 text-[0.6875rem] text-muted">Let&rsquo;s make progress today.</p>
          </div>
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy text-[0.625rem] font-bold text-white">
            M
          </span>
        </div>

        <div className="mt-4 grid flex-1 gap-3 sm:grid-cols-[1fr_10rem]">
          {/* The real, labelled play control lives here - inside the mock's media
              well rather than floating over the whole card. */}
          <div className="relative min-h-[7rem] overflow-hidden rounded-xl border border-line-soft bg-cloud">
            {media}
          </div>

          <div aria-hidden="true" className="hidden rounded-xl border border-line-soft p-3 sm:block">
            <p className="text-[0.625rem] font-semibold text-muted">Your Progress</p>
            <p className="mt-1 text-lg font-extrabold text-com">72%</p>
            <ul className="mt-2 space-y-1">
              {progress.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-4 text-[0.625rem]"
                >
                  <span className="text-muted">{row.label}</span>
                  <span className="font-semibold text-navy">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul aria-hidden="true" className="mt-3 hidden grid-cols-2 gap-2 sm:grid sm:grid-cols-4">
          {tiles.map((tile) => (
            <li
              key={tile.label}
              className="rounded-lg border border-line-soft px-2 py-2.5"
            >
              <Icon name={tile.icon} className="h-3 w-3 text-prep-ink" />
              <p className="mt-1.5 text-[0.625rem] leading-tight font-medium text-navy">
                {tile.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
