import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import useFetch from "../../hooks/useFetch";
import { formatDate } from "../../utils/format";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

export default function LeetCodePage() {
  const { data, setData, loading, error } = useFetch("/leetcode/data", { ignore404: true });
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");

  const analyze = async () => {
    setSyncError("");
    setSyncing(true);
    try {
      const res = await api.post("/leetcode/analyze");
      setData(res.data);
    } catch (err) {
      setSyncError(err.response?.data?.message || "We couldn't reach LeetCode. Try again.");
    } finally {
      setSyncing(false);
    }
  };

  const message = syncError || error;
  const solved = data ? data.easySolved + data.mediumSolved + data.hardSolved || 1 : 1;

  return (
    <>
      <PageHeader
        title="LeetCode"
        subtitle="Your problem-solving record, used to score DSA."
        action={
          <Button onClick={analyze} loading={syncing} loadingText="Analyzing...">
            {data ? "Refresh data" : "Analyze LeetCode"}
          </Button>
        }
      />

      <Alert tone="error" className="mb-6">
        {message && (
          <>
            {message}{" "}
            {message.toLowerCase().includes("profile") && (
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
        <EmptyState icon="💻" title="No LeetCode data yet">
          Run the analysis to see how many problems you have solved and at what difficulty.
        </EmptyState>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Solved" value={data.totalSolved} hint={`Updated ${formatDate(data.lastSynced)}`} />
            <StatCard label="Easy" value={data.easySolved} tone="success" />
            <StatCard label="Medium" value={data.mediumSolved} tone="warning" />
            <StatCard label="Hard" value={data.hardSolved} tone="danger" />
          </div>

          <Card>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-semibold text-ink">Difficulty mix</h2>
              <p className="text-sm text-muted">Global rank {Number(data.ranking).toLocaleString()}</p>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-page">
              <div className="bg-success-600" style={{ width: `${(data.easySolved / solved) * 100}%` }} />
              <div className="bg-warning-600" style={{ width: `${(data.mediumSolved / solved) * 100}%` }} />
              <div className="bg-danger-600" style={{ width: `${(data.hardSolved / solved) * 100}%` }} />
            </div>
            <div className="mt-3 flex gap-5 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success-600" /> Easy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-warning-600" /> Medium
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-danger-600" /> Hard
              </span>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
