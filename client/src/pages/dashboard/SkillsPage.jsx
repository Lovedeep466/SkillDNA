import { useState } from "react";
import api from "../../services/api";
import useFetch from "../../hooks/useFetch";
import { formatDate } from "../../utils/format";
import { scoreTone } from "../../utils/status";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ProgressBar from "../../components/ui/ProgressBar";
import ScoreRing from "../../components/ui/ScoreRing";

export default function SkillsPage() {
  const { data, setData, loading, error } = useFetch("/skills/data", { ignore404: true });
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState("");

  const calculate = async () => {
    setCalcError("");
    setCalculating(true);
    try {
      const res = await api.post("/skills/calculate");
      setData(res.data);
    } catch (err) {
      setCalcError(err.response?.data?.message || "We couldn't calculate your skills. Try again.");
    } finally {
      setCalculating(false);
    }
  };

  const skills = data?.skills || [];

  return (
    <>
      <PageHeader
        title="Skill DNA"
        subtitle="A score for each skill, built from your GitHub, projects and LeetCode activity."
        action={
          <Button onClick={calculate} loading={calculating} loadingText="Calculating...">
            {data ? "Recalculate" : "Calculate my skills"}
          </Button>
        }
      />

      <Alert tone="error" className="mb-6">
        {calcError || error}
      </Alert>

      {loading ? (
        <Spinner />
      ) : !data || skills.length === 0 ? (
        <EmptyState icon="🧬" title="Your skill scores will appear here">
          Analyze GitHub and LeetCode and add a project first, then calculate. Each score comes with its evidence.
        </EmptyState>
      ) : (
        <div className="space-y-6">
          <Card className="flex flex-wrap items-center gap-8">
            <ScoreRing value={data.overallScore} label="overall" />
            <div>
              <h2 className="text-lg font-semibold text-ink">Overall score</h2>
              <p className="mt-1 max-w-md text-sm text-muted">
                The average across {skills.length} skills found in your activity.
              </p>
              <p className="mt-3 text-sm text-ink">
                Strongest skill: <span className="font-semibold">{skills[0].name}</span> ({skills[0].score}/100)
              </p>
              <p className="mt-1 text-xs text-subtle">Last calculated {formatDate(data.lastCalculated)}</p>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((skill) => (
              <Card key={skill.name} padding="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-ink">{skill.name}</h3>
                  <Badge tone={scoreTone(skill.score)}>{skill.score}/100</Badge>
                </div>
                <ProgressBar value={skill.score} tone={scoreTone(skill.score)} />
                <p className="mb-2 mt-4 text-xs font-medium text-muted">Why this score</p>
                <ul className="space-y-1.5 text-sm text-muted">
                  {skill.evidence.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-subtle" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
