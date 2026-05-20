import { useState } from "react";
import { api } from "../api";
import "../styles/aipanel.css";

export default function AiPanel({ resumeId, jobTitle, onClose, onApply, notify }) {
  const [tab, setTab] = useState("enhance");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [targetRole, setTargetRole] = useState(jobTitle || "");

  const switchTab = (t) => {
    setTab(t);
    setResult(null);
  };

  const runEnhance = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await api.enhanceResume(resumeId);
      setResult({ kind: "enhance", data });
    } catch (e) {
      notify("Enhancement failed: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const runSuggestions = async () => {
    if (!targetRole.trim()) return notify("Enter a target role first.", "error");
    setLoading(true);
    setResult(null);
    try {
      const data = await api.getSuggestions(resumeId, targetRole.trim());
      setResult({ kind: "suggestions", data });
    } catch (e) {
      notify("Suggestions failed: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const applyAndClose = () => {
    if (result?.kind !== "enhance") return;
    onApply(result.data.enhancedSummary || "");
    onClose();
  };

  const parseBullets = (raw) => {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
  };

  const parseList = (raw) => {
    if (Array.isArray(raw)) return raw;
    return [];
  };

  return (
    <aside className="ai-panel">
      <div className="ai-panel-head">
        <div className="ai-panel-title">
          <span className="ai-star">✦</span> AI Assistant
        </div>
        <button className="ai-close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="ai-tabs">
        <button className={`ai-tab ${tab === "enhance" ? "ai-tab-active" : ""}`} onClick={() => switchTab("enhance")}>
          Enhance
        </button>
        <button className={`ai-tab ${tab === "suggestions" ? "ai-tab-active" : ""}`} onClick={() => switchTab("suggestions")}>
          Skill Gap
        </button>
      </div>

      <div className="ai-panel-body">
        {tab === "enhance" && (
          <>
            <p className="ai-desc">
              Rewrites your professional summary and generates strong achievement-focused bullet points from your experience data.
            </p>
            <button className="ai-run-btn" onClick={runEnhance} disabled={loading}>
              {loading ? <><span className="ai-spinner" /> Enhancing…</> : "✦ Enhance my resume"}
            </button>

            {result?.kind === "enhance" && (
              <div className="ai-result">
                <div className="ai-result-block">
                  <h4>Enhanced summary</h4>
                  <p className="ai-result-text">{result.data.enhancedSummary}</p>
                </div>

                {parseBullets(result.data.bulletPoints).length > 0 && (
                  <div className="ai-result-block">
                    <h4>Achievement bullets</h4>
                    <ul className="ai-bullets">
                      {parseBullets(result.data.bulletPoints).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.data.improvements && (
                  <div className="ai-result-block ai-improvements">
                    <h4>Changes made</h4>
                    <p>{result.data.improvements}</p>
                  </div>
                )}

                <button className="ai-apply-btn" onClick={applyAndClose}>
                  Apply summary to resume →
                </button>
              </div>
            )}
          </>
        )}

        {tab === "suggestions" && (
          <>
            <p className="ai-desc">
              Identify what skills and certifications you need to land your target role.
            </p>
            <div className="ai-role-row">
              <input
                className="ai-role-input"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                onKeyDown={(e) => e.key === "Enter" && runSuggestions()}
              />
              <button className="ai-run-btn compact" onClick={runSuggestions} disabled={loading}>
                {loading ? <span className="ai-spinner" /> : "Analyse"}
              </button>
            </div>

            {result?.kind === "suggestions" && (
              <div className="ai-result">
                <div className="ai-result-block">
                  <h4>Missing skills</h4>
                  <div className="ai-tag-wrap">
                    {parseList(result.data.missingSkills).map((s, i) => (
                      <span className="ai-tag gap" key={i}>{s}</span>
                    ))}
                  </div>
                </div>

                <div className="ai-result-block">
                  <h4>Recommended certifications</h4>
                  <div className="ai-tag-wrap">
                    {parseList(result.data.certifications).map((c, i) => (
                      <span className="ai-tag cert" key={i}>{c}</span>
                    ))}
                  </div>
                </div>

                {result.data.salaryRange && (
                  <div className="ai-result-block">
                    <h4>Salary range</h4>
                    <p className="ai-salary">{result.data.salaryRange}</p>
                  </div>
                )}

                {result.data.advice && (
                  <div className="ai-result-block">
                    <h4>Career advice</h4>
                    <p className="ai-result-text">{result.data.advice}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
