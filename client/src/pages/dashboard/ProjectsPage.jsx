import { useState } from "react";
import api from "../../services/api";
import useFetch from "../../hooks/useFetch";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

const emptyForm = { name: "", description: "", techStack: "", githubUrl: "", liveUrl: "" };

export default function ProjectsPage() {
  const { data, setData, loading, error } = useFetch("/projects");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const projects = data || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const techStack = form.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await api.post("/projects", { ...form, techStack });
      setData([res.data, ...projects]);
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.response?.data?.message || "We couldn't add that project. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project? This can't be undone.")) return;
    try {
      await api.delete(`/projects/${id}`);
      setData(projects.filter((p) => p._id !== id));
    } catch {
      setFormError("We couldn't delete that project. Try again.");
    }
  };

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Projects add evidence for the technologies you list. Use the same names as in your resume, like React or Node.js."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={handleAdd} className="lg:col-span-2">
          <Card>
            <h2 className="mb-4 font-semibold text-ink">Add a project</h2>
            <div className="space-y-4">
              <Alert tone="error">{formError}</Alert>
              <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
              <Input
                label="What it does"
                name="description"
                placeholder="A short one-line summary"
                value={form.description}
                onChange={handleChange}
              />
              <Input
                label="Tech stack"
                name="techStack"
                placeholder="React, Node.js, MongoDB"
                value={form.techStack}
                onChange={handleChange}
              />
              <Input
                label="GitHub link"
                name="githubUrl"
                placeholder="https://github.com/..."
                value={form.githubUrl}
                onChange={handleChange}
              />
              <Input
                label="Live link"
                name="liveUrl"
                placeholder="https://..."
                value={form.liveUrl}
                onChange={handleChange}
              />
              <Button type="submit" loading={saving} loadingText="Adding..." className="w-full">
                Add project
              </Button>
            </div>
          </Card>
        </form>

        <div className="space-y-4 lg:col-span-3">
          {loading ? (
            <Spinner />
          ) : error ? (
            <Alert tone="error">{error}</Alert>
          ) : projects.length === 0 ? (
            <EmptyState icon="📁" title="No projects yet">
              Add your first project with the form. It will count towards every technology you list.
            </EmptyState>
          ) : (
            projects.map((project) => (
              <Card key={project._id} padding="p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-ink">{project.name}</h3>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(project._id)}>
                    Delete
                  </Button>
                </div>
                {project.description && <p className="mt-1 text-sm text-muted">{project.description}</p>}
                {project.techStack?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} tone="primary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                {(project.githubUrl || project.liveUrl) && (
                  <div className="mt-3 flex gap-4 text-sm font-medium">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        Live site
                      </a>
                    )}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
