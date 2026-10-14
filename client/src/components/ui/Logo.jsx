export default function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
          light ? "bg-white/20 text-white" : "bg-primary-600 text-white"
        }`}
      >
        S
      </span>
      <span className={`text-lg font-bold ${light ? "text-white" : "text-ink"}`}>SkillDNA</span>
    </div>
  );
}
