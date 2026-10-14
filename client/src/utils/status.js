// Maps backend values to colours and wording, so every page agrees.

export const statusTone = (status) =>
  status === "Good" ? "success" : status === "Improve" ? "warning" : "danger";

export const statusLabel = (status) =>
  status === "Good" ? "On target" : status === "Improve" ? "Needs work" : "Major gap";

export const priorityTone = (priority) => (priority === "High" ? "danger" : "warning");

export const scoreTone = (score) => (score >= 70 ? "success" : score >= 40 ? "primary" : "warning");

// When the API says a step is missing, point the user to the page that fixes it.
export function fixLinkFor(message = "") {
  const text = message.toLowerCase();
  if (text.includes("target role")) return { to: "/dashboard/profile", label: "Set your target role" };
  if (text.includes("calculate")) return { to: "/dashboard/skills", label: "Calculate your skills" };
  return null;
}
