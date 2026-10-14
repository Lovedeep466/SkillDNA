import Card from "./Card";

export default function EmptyState({ icon = "📭", title, children, action }) {
  return (
    <Card className="py-12 text-center">
      <div className="mb-3 text-4xl" aria-hidden="true">
        {icon}
      </div>
      <h2 className="font-semibold text-ink">{title}</h2>
      {children && <p className="mx-auto mt-1 max-w-md text-sm text-muted">{children}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Card>
  );
}
