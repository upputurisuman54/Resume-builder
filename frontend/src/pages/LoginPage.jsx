import { useState } from "react";
import { api } from "../api";
import "../styles/auth.css";

export default function LoginPage({ onLogin, goRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      onLogin(res.token);
    } catch {
      setError("Invalid email or password.");
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
            Your résumé,<br />
            <em>reimagined.</em>
          </h1>
          <ul className="feature-list">
            <li><span className="feat-dot" />AI-enhanced professional summaries</li>
            <li><span className="feat-dot" />Skill gap analysis for any role</li>
            <li><span className="feat-dot" />One-click PDF export</li>
            <li><span className="feat-dot" />Live preview as you type</li>
          </ul>
        </div>
        <div className="auth-left-grid" aria-hidden="true">
          {Array.from({ length: 64 }).map((_, i) => <div key={i} className="grid-cell" />)}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <p className="auth-eyebrow">Welcome back</p>
          <h2 className="auth-card-title">Sign in</h2>

          <form onSubmit={submit} noValidate>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="suman@gmail.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Sign in →"}
            </button>
          </form>

          <p className="auth-switch">
            No account?{" "}
            <button className="link-btn" onClick={goRegister}>Create one</button>
          </p>
        </div>
      </div>
    </div>
  );
}
