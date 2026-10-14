import Logo from "../ui/Logo";
import Card from "../ui/Card";

const points = [
  "One profile built from your real activity",
  "A score with the evidence behind it",
  "A roadmap for the role you want",
];

// Shared frame for the login and register pages.
export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary-600 p-12 text-white lg:flex">
        <Logo light />
        <div>
          <h2 className="max-w-md text-4xl font-bold leading-tight">
            Skills backed by evidence, not claims.
          </h2>
          <p className="mt-4 max-w-md text-primary-100">
            Connect GitHub, LeetCode and your projects. SkillDNA scores each skill and shows
            exactly why.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-primary-100">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-primary-200">Built to show what you can actually do.</p>
      </div>

      <div className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <Card padding="p-8">
            <h1 className="text-2xl font-bold text-ink">{title}</h1>
            <p className="mt-1 mb-6 text-sm text-muted">{subtitle}</p>
            {children}
          </Card>
          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        </div>
      </div>
    </div>
  );
}
