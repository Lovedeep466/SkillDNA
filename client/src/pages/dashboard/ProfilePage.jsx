import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { TARGET_ROLES, EXPERIENCE_LEVELS } from "../../utils/constants";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";

const emptyForm = {
  targetRole: "",
  experienceLevel: "",
  education: "",
  githubUsername: "",
  leetcodeUsername: "",
};

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get("/auth/profile")
      .then((res) => {
        if (!active) return;
        const p = res.data;
        setForm({
          targetRole: p.targetRole || "",
          experienceLevel: p.experienceLevel || "",
          education: p.education || "",
          githubUsername: p.githubUsername || "",
          leetcodeUsername: p.leetcodeUsername || "",
        });
      })
      .catch(() => {
        if (active) {
          setNotice({ tone: "error", text: "We couldn't load your profile. Refresh the page to try again." });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", form);
      login({ ...res.data, token: user.token });
      setNotice({ tone: "success", text: "Profile saved." });
    } catch (err) {
      setNotice({
        tone: "error",
        text: err.response?.data?.message || "We couldn't save your profile. Try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Your target role and linked accounts decide how your skills are scored and compared."
      />

      {loading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <Alert tone={notice?.tone}>{notice?.text}</Alert>

          <Card>
            <h2 className="mb-4 font-semibold text-ink">About you</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Target role" name="targetRole" value={form.targetRole} onChange={handleChange}>
                <option value="">Choose a role</option>
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
              <Select
                label="Experience level"
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
              >
                <option value="">Choose a level</option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
              <div className="sm:col-span-2">
                <Input
                  label="Education"
                  name="education"
                  placeholder="B.Tech CSE"
                  value={form.education}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-ink">Linked accounts</h2>
            <p className="mb-4 mt-1 text-sm text-muted">
              We read only your public data. Save here, then run the analysis from the GitHub and LeetCode pages.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="GitHub username"
                name="githubUsername"
                placeholder="octocat"
                value={form.githubUsername}
                onChange={handleChange}
              />
              <Input
                label="LeetCode username"
                name="leetcodeUsername"
                placeholder="your-handle"
                value={form.leetcodeUsername}
                onChange={handleChange}
              />
            </div>
          </Card>

          <Button type="submit" loading={saving} loadingText="Saving...">
            Save changes
          </Button>
        </form>
      )}
    </>
  );
}
