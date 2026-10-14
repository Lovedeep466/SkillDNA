import useFetch from "../../hooks/useFetch";
import { statusTone, statusLabel, fixLinkFor } from "../../utils/status";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ProgressBar from "../../components/ui/ProgressBar";
import ScoreRing from "../../components/ui/ScoreRing";
import { Link } from "react-router-dom";

export default function SkillGapPage() {
  const { data, loading, error, reload } = useFetch("/skill-gap");

  const rows = data?.gapAnalysis || [];
  const onTarget = rows.filter((r) => r.status === "Good").length;
  const needsWork = rows.filter((r) => r.status === "Improve").length;
  const majorGap = rows.filter((r) => r.status === "Major Gap").length;
  const readiness = rows.length ? Math.round((onTarget / rows.length) * 100) : 0;
  const fix = fixLinkFor(error);

  return (
    <>
      <PageHeader
        title="Skill gap"
        subtitle={
          data
            ? `How your scores compare with what a ${data.targetRole} needs.`
            : "How your scores compare with what your target role needs."
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
          icon="🎯"
          title="Your skill gap isn't ready yet"
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
      ) : (
        <div className="space-y-6">
          <Card className="flex flex-wrap items-center gap-8">
            <ScoreRing value={readiness} label="ready" />
            <div className="grid flex-1 grid-cols-3 gap-4 text-center sm:min-w-72">
              <div>
                <p className="text-2xl font-bold text-success-600">{onTarget}</p>
                <p className="text-xs text-muted">On target</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning-600">{needsWork}</p>
                <p className="text-xs text-muted">Need work</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-danger-600">{majorGap}</p>
                <p className="text-xs text-muted">Major gaps</p>
              </div>
            </div>
          </Card>

          <p className="text-xs text-muted">The dark tick on each bar marks the score your target role asks for.</p>

          <div className="space-y-3">
            {rows.map((item) => (
              <Card key={item.skill} padding="p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-ink">{item.skill}</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted">
                      {item.yourScore} of {item.requiredScore} needed
                    </span>
                    <Badge tone={statusTone(item.status)}>{statusLabel(item.status)}</Badge>
                  </div>
                </div>
                <ProgressBar value={item.yourScore} marker={item.requiredScore} tone={statusTone(item.status)} />
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
