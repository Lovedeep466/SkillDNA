import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { priorityTone, fixLinkFor } from "../../utils/status";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ProgressBar from "../../components/ui/ProgressBar";

export default function RoadmapPage() {
  const { data, loading, error, reload } = useFetch("/roadmap");

  const steps = data?.roadmap || [];
  const fix = fixLinkFor(error);

  return (
    <>
      <PageHeader
        title="Roadmap"
        subtitle={
          data
            ? `What to learn next to become a ${data.targetRole}, biggest gaps first.`
            : "What to learn next, biggest gaps first."
        }
        action={
          data && (
            <Button variant="secondary" onClick={reload}>
              Refresh
            </Button>
          )
        }
      />

      {loading ? (
        <Spinner />
      ) : error ? (
        <EmptyState
          icon="🗺️"
          title="Your roadmap isn't ready yet"
          action={
            fix && (
              <Button as={Link} to={fix.to}>
                {fix.label}
              </Button>
            )
          }
        >
          {error}
        </EmptyState>
      ) : steps.length === 0 ? (
        <EmptyState icon="🎉" title="No gaps to close">
          Your scores meet every requirement for this role. Recalculate after new projects to keep it current.
        </EmptyState>
      ) : (
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step.skill}>
              <Card padding="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700">
                      {index + 1}
                    </span>
                    <h2 className="font-semibold text-ink">{step.skill}</h2>
                  </div>
                  <Badge tone={priorityTone(step.priority)}>{step.priority} priority</Badge>
                </div>

                <ProgressBar value={step.yourScore} marker={step.requiredScore} tone={priorityTone(step.priority)} />
                <p className="mb-4 mt-2 text-xs text-muted">
                  You are at {step.yourScore}. This role needs {step.requiredScore}.
                </p>

                <ul className="space-y-2 text-sm text-ink">
                  {step.resources.map((resource) => (
                    <li key={resource} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                      {resource}
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
