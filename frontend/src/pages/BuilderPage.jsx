import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import ResumeForm from "../components/ResumeForm";
import ResumePreview from "../components/ResumePreview";
import AiPanel from "../components/AiPanel";
import Toast from "../components/Toast";
import "../styles/builder.css";

const emptyResume = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  summary: "",
  experiences: [],
  educations: [],
  skills: [],
  projects: [],
  certifications: [],
};

const normalizeResume = (raw) => ({
  ...raw,
  experiences: (raw.experiences || []).map(e => ({
    jobTitle: e.jobTitle || "",
    company: e.company || "",
    startDate: e.startDate || "",
    endDate: e.endDate || "",
    description: e.description || "",
    descriptionMode: e.descriptionMode || "bullets",
  })),
  educations: (raw.educations || []).map(e => ({
    degree: e.degree || "",
    institution: e.institution || "",
    cgpa: e.cgpa || "",
    startYear: e.startYear || "",
    endYear: e.endYear || "",
  })),
  skills: (raw.skills || []).map(s => ({
    category: s.category || "",
    skillList: s.skillList || "",
  })),
  projects: (raw.projects || []).map(p => ({
    title: p.title || "",
    description: p.description || "",
    descriptionMode: p.descriptionMode || "paragraph",
  })),
  certifications: (raw.certifications || []).map(c => ({
    title: c.title || "",
    issuer: c.issuer || "",
    date: c.date || "",
  })),
});

export default function BuilderPage({ onLogout }) {
  const [resumes, setResumes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState(emptyResume);
  const [view, setView] = useState("edit");
  const [saving, setSaving] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadList = useCallback(async () => {
    try {
      const list = await api.listResumes();
      setResumes(list);
      return list;
    } catch {
      notify("Could not load resumes.", "error");
      return [];
    }
  }, [notify]);

  useEffect(() => {
    loadList().then((list) => {
      if (list.length > 0) openResume(list[0].id);
    });
  }, []);

  const openResume = async (id) => {
    try {
      const raw = await api.getResume(id);
      setActiveId(raw.id);
      setDraft(normalizeResume(raw));
      setShowAi(false);
    } catch {
      notify("Could not open resume.", "error");
    }
  };

  const newResume = () => {
    setActiveId(null);
    setDraft({ ...emptyResume });
    setShowAi(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        fullName: draft.fullName,
        email: draft.email,
        phone: draft.phone,
        location: draft.location,
        linkedin: draft.linkedin,
        github: draft.github,
        summary: draft.summary,
        experiences: draft.experiences.map(e => ({
          jobTitle: e.jobTitle || "",
          company: e.company || "",
          startDate: e.startDate || "",
          endDate: e.endDate || "",
          description: e.description || "",
        })),
        educations: draft.educations.map(e => ({
          degree: e.degree || "",
          institution: e.institution || "",
          cgpa: e.cgpa || "",
          startYear: e.startYear || "",
          endYear: e.endYear || "",
        })),
        skills: draft.skills.map(s => ({
          category: s.category || "",
          skillList: s.skillList || "",
        })),
        projects: draft.projects.map(p => ({
          title: p.title || "",
          description: p.description || "",
        })),
        certifications: draft.certifications.map(c => ({
          title: c.title || "",
          issuer: c.issuer || "",
          date: c.date || "",
        })),
      };

      if (activeId) {
        await api.updateResume(activeId, payload);
        notify("Saved.");
      } else {
        const created = await api.createResume(payload);
        setActiveId(created.id);
        notify("Resume created!");
      }
      loadList();
    } catch (e) {
      notify("Save failed: " + e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this resume?")) return;
    try {
      await api.deleteResume(id);
      if (id === activeId) newResume();
      loadList();
      notify("Deleted.");
    } catch {
      notify("Delete failed.", "error");
    }
  };

  const applyEnhancement = (enhancedSummary) => {
    setDraft((prev) => ({ ...prev, summary: enhancedSummary }));
    notify("AI summary applied ✦");
  };

  const downloadPdf = async () => {
    if (!activeId) return notify("Save your resume first.", "error");
    try {
      await api.downloadPdf(activeId, draft.fullName || "resume");
    } catch {
      notify("Download failed.", "error");
    }
  };

  return (
    <div className="builder-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-wordmark">
            <span className="wordmark-diamond">⬡</span>
            ResumeAI
          </div>
          <button className="new-resume-btn" onClick={newResume}>+ New résumé</button>
        </div>

        <div className="resume-list">
          {resumes.length === 0 && (
            <p className="empty-state">No resumes yet.<br />Create your first one.</p>
          )}
          {resumes.map((r) => (
            <div
              key={r.id}
              className={`resume-row ${r.id === activeId ? "active" : ""}`}
              onClick={() => openResume(r.id)}
            >
              <div className="resume-row-name">{r.fullName || "Untitled"}</div>
              <div className="resume-row-role">{r.summary ? r.summary.slice(0, 30) + "..." : "No summary"}</div>
              <button className="resume-row-delete" onClick={(e) => remove(r.id, e)}>✕</button>
            </div>
          ))}
        </div>

        <button className="logout-btn" onClick={onLogout}>Sign out</button>
      </aside>

      <div className="builder-main">
        <header className="builder-header">
          <div className="header-tabs">
            <button className={`tab ${view === "edit" ? "tab-active" : ""}`} onClick={() => setView("edit")}>Edit</button>
            <button className={`tab ${view === "preview" ? "tab-active" : ""}`} onClick={() => setView("preview")}>Preview</button>
          </div>
          <div className="header-actions">
            {activeId && (
              <button className="btn-ai" onClick={() => setShowAi((v) => !v)}>✦ AI</button>
            )}
            <button className="btn-save" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            {activeId && (
              <button className="btn-pdf" onClick={downloadPdf}>↓ PDF</button>
            )}
          </div>
        </header>

        <div className="builder-body">
          {view === "edit" ? (
            <ResumeForm data={draft} onChange={setDraft} />
          ) : (
            <ResumePreview data={draft} />
          )}
        </div>
      </div>

      {showAi && activeId && (
        <AiPanel
          resumeId={activeId}
          onClose={() => setShowAi(false)}
          onApply={applyEnhancement}
          notify={notify}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
