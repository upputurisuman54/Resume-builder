import { useState } from "react";
import { api } from "../api";
import "../styles/auth.css";

export default function RegisterPage({ onSuccess, goLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register(form);
      onSuccess();
    } catch {
      setError("Registration failed. Email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="wordmark">
            <span className="wordmark-diamond">⬡</span>
            <span className="wordmark-text">ResumeAI</span>
          </div>
          <h1 className="auth-headline">
            Build smarter.<br />
            <em>Get hired faster.</em>
          </h1>
          <ul className="feature-list">
            <li><span className="feat-dot" />Free to start, no credit card</li>
            <li><span className="feat-dot" />AI tailored to your job title</li>
            <li><span className="feat-dot" />ATS-optimised output</li>
            <li><span className="feat-dot" />Unlimited resumes</li>
          </ul>
        </div>
        <div className="auth-left-grid" aria-hidden="true">
          {Array.from({ length: 64 }).map((_, i) => <div key={i} className="grid-cell" />)}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <p className="auth-eyebrow">Get started</p>
          <h2 className="auth-card-title">Create account</h2>

          <form onSubmit={submit} noValidate>
            <div className="field-group">
              <label>Full name</label>
              <input
                value={form.name}
                onChange={set("name")}
                placeholder="Suman Kumar"
                required
              />
            </div>
            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="suman@gmail.com"
                required
              />
            </div>
            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Create account →"}
            </button>
          </form>

          <p className="auth-switch">
            Already registered?{" "}
            <button className="link-btn" onClick={goLogin}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
