import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", formData);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
          Create Account
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
          Start tracking your real technical skills
        </p>

        {error && (
          <div
            className="text-sm rounded-xl px-4 py-2 mb-4"
            style={{ backgroundColor: "var(--color-error-bg)", color: "var(--color-error-text)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          <div className="mt-2">
            <Button type="submit" loading={loading}>
              {loading ? "Creating..." : "Register"}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--color-primary)" }} className="font-medium">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;