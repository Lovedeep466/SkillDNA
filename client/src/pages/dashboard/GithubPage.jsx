import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import useFetch from "../../hooks/useFetch";
import { formatDate } from "../../utils/format";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ProgressBar from "../../components/ui/ProgressBar";

export default function GithubPage() {
  const { data, setData, loading, error } = useFetch("/github/data", { ignore404: true });
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");

  const analyze = async () => {
    setSyncError("");
    setSyncing(true);
    try {
      const res = await api.post("/github/analyze");
      setData(res.data);
    } catch (err) {
      setSyncError(err.response?.data?.message || "We couldn't reach GitHub. Try again.");
    } finally {
      setSyncing(false);
    }
  };

  const languages = Object.entries(data?.languages || {}).sort((a, b) => b[1] - a[1]);
  const languageTotal = languages.reduce((sum, [, count]) => sum + count, 0) || 1;
  const recentRepos = [...(data?.repositories || [])]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        title="GitHub"
        subtitle="Languages and repositories from your public profile."
        action={
          <Button onClick={analyze} loading={syncing} loadingText="Analyzing...">
            {data ? "Refresh data" : "Analyze GitHub"}
          </Button>
        }
      />

      <Alert tone="error" className="mb-6">
        {(syncError || error) && (
          <>
            {syncError || error}{" "}
            {(syncError || error).toLowerCase().includes("profile") && (
              <Link to="/dashboard/profile" className="font-semibold underline">
                Open profile
              </Link>
            )}
          </>
        )}
      </Alert>

      {loading ? (
        <Spinner />
      ) : !data ? (
        <EmptyState icon="🐙" title="No GitHub data yet">
          Run the analysis to pull your public repositories and the languages you use.
        </EmptyState>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Repositories" value={data.totalRepos} />
            <StatCard label="Stars earned" value={data.totalStars} />
            <StatCard label="Languages" value={languages.length} hint={`Updated ${formatDate(data.lastSynced)}`} />
          </div>

          <Card>
            <h2 className="mb-4 font-semibold text-ink">Languages by repository</h2>
            {languages.length === 0 ? (
              <p className="text-sm text-muted">GitHub did not report a language for these repositories.</p>
            ) : (
              <ul className="space-y-4">
                {languages.map(([language, count]) => (
                  <li key={language}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium text-ink">{language}</span>
                      <span className="text-muted">
                        {count} {count === 1 ? "repo" : "repos"}
                      </span>
                    </div>
                    <ProgressBar value={(count / languageTotal) * 100} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold text-ink">Recently updated</h2>
            <ul className="divide-y divide-line">
              {recentRepos.map((repo) => (
                <li key={repo.url} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-primary-600 hover:underline"
                    >
                      {repo.name}
                    </a>
                    {repo.description && <p className="truncate text-sm text-muted">{repo.description}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge tone={repo.language === "Unknown" ? "neutral" : "primary"}>
                      {repo.language === "Unknown" ? "No language" : repo.language}
                    </Badge>
                    <span className="text-xs text-subtle">{formatDate(repo.updatedAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </>
  );
}
