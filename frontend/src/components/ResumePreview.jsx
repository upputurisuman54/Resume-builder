import "../styles/preview.css";

const formatMonth = (val) => {
  if (!val) return "";
  if (val.length === 7 && val.includes("-")) {
    const [year, month] = val.split("-");
    const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const m = parseInt(month);
    return months[m] ? `${months[m]} ${year}` : val;
  }
  return val;
};

const dateRange = (start, end) => {
  const s = formatMonth(start);
  const e = end ? formatMonth(end) : (start ? "Present" : "");
  if (!s && !e) return "";
  if (!s) return e;
  return `${s}-${e}`;
};

const formatCertDate = (val) => {
  if (!val) return "";
  if (val.length === 7 && val.includes("-")) {
    const [year, month] = val.split("-");
    const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const m = parseInt(month);
    return months[m] ? `${months[m]} ${year}` : val;
  }
  return val;
};

const stripLeading = (cat) => {
  if (!cat) return "";
  return cat.replace(/[\s:]+$/, "").trim();
};

const stripLeadingColon = (val) => {
  if (!val) return "";
  return val.replace(/^[\s:]+/, "").trim();
};

export default function ResumePreview({ data }) {
  const hasExp = data.experiences?.length > 0;
  const hasEdu = data.educations?.length > 0;
  const hasSkills = data.skills?.length > 0;
  const hasProjects = data.projects?.length > 0;
  const hasCerts = data.certifications?.length > 0;

  const renderExpBullets = (text) => {
    if (!text) return null;
    const lines = text.split(/\n/).map(l => l.replace(/^[•\-\*]\s*/, "").trim()).filter(l => l.length > 0);
    if (lines.length === 0) return null;
    return (
      <ul className="doc-bullets">
        {lines.map((line, i) => <li key={i}>{line}</li>)}
      </ul>
    );
  };

  const renderProjDescription = (text) => {
    if (!text) return null;
    const flat = text.split(/\n/).join(" ").replace(/\s+/g, " ").trim();
    return flat;
  };

  return (
    <div className="preview-scroll">
      <div className="resume-doc">

        <div className="doc-header">
          <div className="doc-name">{(data.fullName || "YOUR NAME").toUpperCase()}</div>

          <div className="doc-contact-line">
            {[data.phone, data.email, data.location].filter(Boolean).map((val, i, arr) => (
              <span key={i}>
                {val}{i < arr.length - 1 ? " | " : ""}
              </span>
            ))}
          </div>

          <div className="doc-contact-line">
            {[data.linkedin, data.github].filter(Boolean).map((val, i, arr) => (
              <span key={i}>
                {val}{i < arr.length - 1 ? " | " : ""}
              </span>
            ))}
          </div>
        </div>

        {data.summary && (
          <div className="doc-section">
            <div className="doc-section-title">PROFESSIONAL SUMMARY</div>
            <p className="doc-body-text" style={{ textAlign: "justify" }}>{data.summary}</p>
          </div>
        )}

        {hasSkills && (
          <div className="doc-section">
            <div className="doc-section-title">SKILLS</div>
            <div className="doc-skills-block">
              {data.skills.map((skill, i) => (
                <p key={i} className="doc-body-text" style={{ marginBottom: "1px" }}>
                  <strong>{stripLeading(skill.category)} :</strong>{" "}
                  {stripLeadingColon(skill.skillList)}
                </p>
              ))}
            </div>
          </div>
        )}

        {hasProjects && (
          <div className="doc-section">
            <div className="doc-section-title">PROJECTS</div>
            {data.projects.map((proj, i) => (
              <p key={i} className="doc-body-text" style={{ marginBottom: "2px" }}>
                <strong>{proj.title}:</strong>{" "}
                {renderProjDescription(proj.description)}
              </p>
            ))}
          </div>
        )}

        {hasExp && (
          <div className="doc-section">
            <div className="doc-section-title">PROFESSIONAL EXPERIENCE</div>
            {data.experiences.map((exp, i) => (
              <div key={i} className="doc-exp-block">
                <p className="doc-exp-header">
                  <strong>
                    {exp.jobTitle}
                    {exp.company ? ` | ${exp.company}` : ""}
                    {(exp.startDate || exp.endDate) ? ` | ${dateRange(exp.startDate, exp.endDate)}` : ""}
                  </strong>
                </p>
                {renderExpBullets(exp.description)}
              </div>
            ))}
          </div>
        )}

        {hasEdu && (
          <div className="doc-section">
            <div className="doc-section-title">EDUCATION</div>
            {data.educations.map((edu, i) => (
              <p key={i} className="doc-body-text" style={{ marginBottom: "1.5px" }}>
                <strong>{edu.degree}</strong>
                {edu.institution ? `, ${edu.institution}` : ""}
                {edu.cgpa ? ` | CGPA:${edu.cgpa}` : ""}
              </p>
            ))}
          </div>
        )}

        {hasCerts && (
          <div className="doc-section">
            <div className="doc-section-title">CERTIFICATIONS</div>
            <ul className="doc-bullets">
              {data.certifications.map((cert, i) => (
                <li key={i} className="doc-body-text">
                  <strong>{cert.title}</strong>
                  {cert.issuer ? ` | ${cert.issuer}` : ""}
                  {cert.date ? ` (${formatCertDate(cert.date)})` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
