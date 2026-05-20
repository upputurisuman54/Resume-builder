import { useState } from "react";
import "../styles/form.css";

function Accordion({ label, count, children, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="accordion">
      <button className="accordion-trigger" onClick={() => setOpen(!open)}>
        <span className="accordion-label">
          {label}
          {count !== undefined && <span className="accordion-count">{count}</span>}
        </span>
        <span className={`accordion-chevron ${open ? "open" : ""}`}>›</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}

function Row({ children }) {
  return <div className="form-row">{children}</div>;
}

function Field({ label, children, full }) {
  return (
    <div className={`form-field ${full ? "full" : ""}`}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function ModeToggle({ value, onChange }) {
  return (
    <div className="mode-toggle">
      <span className="mode-label">Description style:</span>
      <button
        className={`mode-btn ${value === "paragraph" ? "active" : ""}`}
        onClick={() => onChange("paragraph")}
        type="button"
      >
        Paragraph
      </button>
      <button
        className={`mode-btn ${value === "bullets" ? "active" : ""}`}
        onClick={() => onChange("bullets")}
        type="button"
      >
        Bullet Points
      </button>
    </div>
  );
}

export default function ResumeForm({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });

  const addExp = () => set("experiences", [...data.experiences, {
    jobTitle: "", company: "", startDate: "", endDate: "", description: "", descriptionMode: "bullets"
  }]);
  const updateExp = (i, field, val) => {
    const list = [...data.experiences];
    list[i] = { ...list[i], [field]: val };
    set("experiences", list);
  };
  const removeExp = (i) => set("experiences", data.experiences.filter((_, j) => j !== i));

  const addEdu = () => set("educations", [...data.educations, {
    degree: "", institution: "", cgpa: "", startYear: "", endYear: ""
  }]);
  const updateEdu = (i, field, val) => {
    const list = [...data.educations];
    list[i] = { ...list[i], [field]: val };
    set("educations", list);
  };
  const removeEdu = (i) => set("educations", data.educations.filter((_, j) => j !== i));

  const addSkill = () => set("skills", [...data.skills, { category: "", skillList: "" }]);
  const updateSkill = (i, field, val) => {
    const list = [...data.skills];
    list[i] = { ...list[i], [field]: val };
    set("skills", list);
  };
  const removeSkill = (i) => set("skills", data.skills.filter((_, j) => j !== i));

  const addProject = () => set("projects", [...data.projects, {
    title: "", description: "", descriptionMode: "paragraph"
  }]);
  const updateProject = (i, field, val) => {
    const list = [...data.projects];
    list[i] = { ...list[i], [field]: val };
    set("projects", list);
  };
  const removeProject = (i) => set("projects", data.projects.filter((_, j) => j !== i));

  const addCert = () => set("certifications", [...data.certifications, {
    title: "", issuer: "", date: ""
  }]);
  const updateCert = (i, field, val) => {
    const list = [...data.certifications];
    list[i] = { ...list[i], [field]: val };
    set("certifications", list);
  };
  const removeCert = (i) => set("certifications", data.certifications.filter((_, j) => j !== i));

  return (
    <div className="resume-form">
      <Accordion label="Personal Info" defaultOpen>
        <Row>
          <Field label="Full name">
            <input value={data.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Suman Kumar" />
          </Field>
          <Field label="Phone">
            <input value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" />
          </Field>
        </Row>
        <Row>
          <Field label="Email">
            <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="suman@gmail.com" />
          </Field>
          <Field label="Location">
            <input value={data.location} onChange={(e) => set("location", e.target.value)} placeholder="Hyderabad" />
          </Field>
        </Row>
        <Row>
          <Field label="LinkedIn">
            <input value={data.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="linkedin.com/in/suman" />
          </Field>
          <Field label="GitHub">
            <input value={data.github} onChange={(e) => set("github", e.target.value)} placeholder="github.com/suman" />
          </Field>
        </Row>
        <Field label="Professional Summary" full>
          <textarea rows={4} value={data.summary} onChange={(e) => set("summary", e.target.value)}
            placeholder="Full Stack Java Developer with hands-on experience..." />
        </Field>
      </Accordion>

      <Accordion label="Skills" count={data.skills.length}>
        <p className="field-hint">Add one row per skill category (e.g. "Programming Languages" → "Java, Python, SQL")</p>
        {data.skills.map((skill, i) => (
          <div className="entry-block" key={i}>
            <div className="entry-block-header">
              <span className="entry-block-label">{skill.category || `Skill group ${i + 1}`}</span>
              <button className="entry-remove" onClick={() => removeSkill(i)}>Remove</button>
            </div>
            <Row>
              <Field label="Category">
                <input value={skill.category} onChange={(e) => updateSkill(i, "category", e.target.value)}
                  placeholder="Programming Languages" />
              </Field>
              <Field label="Skills (comma separated)">
                <input value={skill.skillList} onChange={(e) => updateSkill(i, "skillList", e.target.value)}
                  placeholder="Java, Python, SQL, JavaScript" />
              </Field>
            </Row>
          </div>
        ))}
        <button className="add-entry-btn" onClick={addSkill}>+ Add skill category</button>
      </Accordion>

      <Accordion label="Projects" count={data.projects.length}>
        {data.projects.map((proj, i) => (
          <div className="entry-block" key={i}>
            <div className="entry-block-header">
              <span className="entry-block-label">{proj.title || `Project ${i + 1}`}</span>
              <button className="entry-remove" onClick={() => removeProject(i)}>Remove</button>
            </div>
            <Field label="Project title" full>
              <input value={proj.title} onChange={(e) => updateProject(i, "title", e.target.value)}
                placeholder="Question Paper Generator System" />
            </Field>
            <ModeToggle
              value={proj.descriptionMode || "paragraph"}
              onChange={(val) => updateProject(i, "descriptionMode", val)}
            />
            <Field label={proj.descriptionMode === "bullets" ? "Description (one bullet per line)" : "Description"} full>
              <textarea rows={4} value={proj.description}
                onChange={(e) => updateProject(i, "description", e.target.value)}
                placeholder={proj.descriptionMode === "bullets"
                  ? "Developed REST APIs for efficient data processing\nOptimized database queries reducing response time by 30%"
                  : "Developed a full-stack web application using Java, Spring Boot..."
                }
              />
            </Field>
          </div>
        ))}
        <button className="add-entry-btn" onClick={addProject}>+ Add project</button>
      </Accordion>

      <Accordion label="Professional Experience" count={data.experiences.length}>
        {data.experiences.map((exp, i) => (
          <div className="entry-block" key={i}>
            <div className="entry-block-header">
              <span className="entry-block-label">{exp.jobTitle || `Experience ${i + 1}`}</span>
              <button className="entry-remove" onClick={() => removeExp(i)}>Remove</button>
            </div>
            <Row>
              <Field label="Job title">
                <input value={exp.jobTitle} onChange={(e) => updateExp(i, "jobTitle", e.target.value)}
                  placeholder="Java Full Stack Developer Intern" />
              </Field>
              <Field label="Company">
                <input value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)}
                  placeholder="EXCELR" />
              </Field>
            </Row>
            <Row>
              <Field label="Start date">
                <input type="month" value={exp.startDate} onChange={(e) => updateExp(i, "startDate", e.target.value)} />
              </Field>
              <Field label="End date">
                <input type="month" value={exp.endDate} onChange={(e) => updateExp(i, "endDate", e.target.value)} />
              </Field>
            </Row>
            <ModeToggle
              value={exp.descriptionMode || "bullets"}
              onChange={(val) => updateExp(i, "descriptionMode", val)}
            />
            <Field label={exp.descriptionMode === "bullets" ? "Responsibilities (one bullet per line)" : "Description"} full>
              <textarea rows={4} value={exp.description}
                onChange={(e) => updateExp(i, "description", e.target.value)}
                placeholder={exp.descriptionMode === "bullets"
                  ? "Developed and maintained web applications using Java, Spring Boot\nDesigned RESTful APIs for backend processing\nOptimized database queries and improved performance"
                  : "Developed and maintained web applications..."
                }
              />
            </Field>
          </div>
        ))}
        <button className="add-entry-btn" onClick={addExp}>+ Add experience</button>
      </Accordion>

      <Accordion label="Education" count={data.educations.length}>
        {data.educations.map((edu, i) => (
          <div className="entry-block" key={i}>
            <div className="entry-block-header">
              <span className="entry-block-label">{edu.institution || `Education ${i + 1}`}</span>
              <button className="entry-remove" onClick={() => removeEdu(i)}>Remove</button>
            </div>
            <Row>
              <Field label="Degree">
                <input value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)}
                  placeholder="Bachelor of Computer Science" />
              </Field>
              <Field label="Institution">
                <input value={edu.institution} onChange={(e) => updateEdu(i, "institution", e.target.value)}
                  placeholder="MVR College of Engineering" />
              </Field>
            </Row>
            <Row>
              <Field label="Start year">
                <input value={edu.startYear} onChange={(e) => updateEdu(i, "startYear", e.target.value)}
                  placeholder="2019" />
              </Field>
              <Field label="End year">
                <input value={edu.endYear} onChange={(e) => updateEdu(i, "endYear", e.target.value)}
                  placeholder="2023" />
              </Field>
            </Row>
            <Field label="CGPA">
              <input value={edu.cgpa} onChange={(e) => updateEdu(i, "cgpa", e.target.value)}
                placeholder="7.4" />
            </Field>
          </div>
        ))}
        <button className="add-entry-btn" onClick={addEdu}>+ Add education</button>
      </Accordion>

      <Accordion label="Certifications" count={data.certifications.length}>
        {data.certifications.map((cert, i) => (
          <div className="entry-block" key={i}>
            <div className="entry-block-header">
              <span className="entry-block-label">{cert.title || `Certification ${i + 1}`}</span>
              <button className="entry-remove" onClick={() => removeCert(i)}>Remove</button>
            </div>
            <Row>
              <Field label="Certificate title">
                <input value={cert.title} onChange={(e) => updateCert(i, "title", e.target.value)}
                  placeholder="Java Full Stack Development" />
              </Field>
              <Field label="Issuer">
                <input value={cert.issuer} onChange={(e) => updateCert(i, "issuer", e.target.value)}
                  placeholder="CV Corp Training Institute" />
              </Field>
            </Row>
            <Field label="Date">
              <input type="month" value={cert.date} onChange={(e) => updateCert(i, "date", e.target.value)} />
            </Field>
          </div>
        ))}
        <button className="add-entry-btn" onClick={addCert}>+ Add certification</button>
      </Accordion>
    </div>
  );
}
