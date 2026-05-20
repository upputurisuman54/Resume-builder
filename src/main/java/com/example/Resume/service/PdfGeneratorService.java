package com.example.Resume.service;

import com.example.Resume.entity.*;
import org.springframework.stereotype.Service;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfGeneratorService {

    public byte[] generateResumePdf(Resume resume) {
        String html = buildHtml(resume);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, "http://localhost/");
            builder.toStream(out);
            builder.run();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }
    }

    private String buildHtml(Resume resume) {
        StringBuilder sb = new StringBuilder();

        sb.append("<!DOCTYPE html><html><head><meta charset='UTF-8'/><style>");
        sb.append("* { margin: 0; padding: 0; box-sizing: border-box; }");
        sb.append("@page { size: A4; margin: 12mm 15mm 12mm 15mm; }");
        sb.append("body { font-family: Arial, sans-serif; font-size: 9.5pt; color: #000; line-height: 1.35; }");
        sb.append("table { width: 100%; border-collapse: collapse; }");
        sb.append("td { vertical-align: top; padding: 0; }");
        sb.append("ul { margin: 0; padding: 0; list-style-type: disc; margin-left: 13pt; }");
        sb.append("li { margin-bottom: 1.5pt; font-size: 9.5pt; line-height: 1.35; }");
        sb.append("p { margin: 0; padding: 0; }");
        sb.append("a { color: #000; text-decoration: underline; }");
        sb.append("</style></head><body>");

        sb.append(headerBlock(resume));

        if (notEmpty(resume.getSummary())) {
            sb.append(sectionTitle("PROFESSIONAL SUMMARY"));
            sb.append("<p style='font-size:9.5pt; margin-bottom:0; line-height:1.35; text-align:justify;'>")
              .append(esc(resume.getSummary())).append("</p>");
        }

        if (resume.getSkills() != null && !resume.getSkills().isEmpty()) {
            sb.append(sectionTitle("SKILLS"));
            sb.append(skillsBlock(resume.getSkills()));
        }

        if (resume.getProjects() != null && !resume.getProjects().isEmpty()) {
            sb.append(sectionTitle("PROJECTS"));
            for (Project proj : resume.getProjects()) {
                sb.append(projectBlock(proj));
            }
        }

        if (resume.getExperiences() != null && !resume.getExperiences().isEmpty()) {
            sb.append(sectionTitle("PROFESSIONAL EXPERIENCE"));
            for (Experience exp : resume.getExperiences()) {
                sb.append(experienceBlock(exp));
            }
        }

        if (resume.getEducations() != null && !resume.getEducations().isEmpty()) {
            sb.append(sectionTitle("EDUCATION"));
            for (Education edu : resume.getEducations()) {
                sb.append(educationBlock(edu));
            }
        }

        if (resume.getCertifications() != null && !resume.getCertifications().isEmpty()) {
            sb.append(sectionTitle("CERTIFICATIONS"));
            sb.append(certificationsBlock(resume.getCertifications()));
        }

        sb.append("</body></html>");
        return sb.toString();
    }

    private String headerBlock(Resume resume) {
        StringBuilder sb = new StringBuilder();

        String fullName = resume.getFullName() != null ? resume.getFullName().toUpperCase().trim() : "";
        sb.append("<p style='text-align:center; font-size:18pt; font-weight:bold; "
                + "line-height:1.2; margin-bottom:3pt;'>")
          .append(esc(fullName)).append("</p>");

        StringBuilder line2 = new StringBuilder();
        if (notEmpty(resume.getPhone())) {
            appendRaw(line2, esc(resume.getPhone()));
        }
        if (notEmpty(resume.getEmail())) {
            String mail = resume.getEmail().trim();
            appendRaw(line2, "<a href='mailto:" + esc(mail) + "'>" + esc(mail) + "</a>");
        }
        if (notEmpty(resume.getLocation())) {
            appendRaw(line2, esc(resume.getLocation()));
        }
        if (line2.length() > 0) {
            sb.append("<p style='text-align:center; font-size:9.5pt; line-height:1.4; margin-bottom:1pt;'>")
              .append(line2).append("</p>");
        }

        StringBuilder line3 = new StringBuilder();
        if (notEmpty(resume.getLinkedin())) {
            String raw = resume.getLinkedin().trim();
            String href = raw.startsWith("http") ? raw : "https://" + raw;
            appendRaw(line3, "<a href='" + esc(href) + "'>" + esc(raw) + "</a>");
        }
        if (notEmpty(resume.getGithub())) {
            String raw = resume.getGithub().trim();
            String href = raw.startsWith("http") ? raw : "https://" + raw;
            appendRaw(line3, "<a href='" + esc(href) + "'>" + esc(raw) + "</a>");
        }
        if (line3.length() > 0) {
            sb.append("<p style='text-align:center; font-size:9.5pt; line-height:1.4; margin-bottom:0;'>")
              .append(line3).append("</p>");
        }

        return sb.toString();
    }

    private void appendRaw(StringBuilder sb, String html) {
        if (sb.length() > 0) sb.append(" | ");
        sb.append(html);
    }

    private String sectionTitle(String title) {
        return "<p style='font-size:11.5pt; font-weight:bold; "
                + "border-bottom:1.5pt solid #000; padding-bottom:1pt; "
                + "margin-top:7pt; margin-bottom:2pt;'>"
                + title + "</p>";
    }

    private String skillsBlock(List<Skill> skills) {
        StringBuilder sb = new StringBuilder();
        for (Skill skill : skills) {
            String rawCat = skill.getCategory() != null ? skill.getCategory() : "";
            rawCat = rawCat.replaceAll("[:\\s]+$", "").trim();
            String cat = capitalize(rawCat);

            String vals = skill.getSkillList() != null ? skill.getSkillList().trim() : "";
            vals = vals.replaceAll("^[:\\s]+", "").trim();

            sb.append("<p style='font-size:9.5pt; line-height:1.35; margin-bottom:1pt;'>")
              .append("<span style='font-weight:bold;'>").append(esc(cat)).append(" :</span> ")
              .append(esc(vals))
              .append("</p>");
        }
        return sb.toString();
    }

    private String experienceBlock(Experience exp) {
        StringBuilder sb = new StringBuilder();

        String jobTitle = notEmpty(exp.getJobTitle()) ? esc(exp.getJobTitle()) : "";
        String company = notEmpty(exp.getCompany()) ? esc(exp.getCompany()) : "";
        String dateRange = esc(formatDateRange(exp.getStartDate(), exp.getEndDate()));

        sb.append("<p style='font-size:9.5pt; font-weight:bold; line-height:1.35; "
                + "margin-bottom:1pt; margin-top:3pt;'>")
          .append(jobTitle).append(" | ").append(company).append(" | ").append(dateRange)
          .append("</p>");

        if (notEmpty(exp.getDescription())) {
            String desc = exp.getDescription().trim();
            sb.append("<ul style='margin-top:1pt; margin-bottom:3pt;'>");
            for (String line : desc.split("\n")) {
                String trimmed = line.replaceAll("^[-\u2022*\\s]+", "").trim();
                if (!trimmed.isEmpty()) {
                    sb.append("<li style='font-size:9.5pt; line-height:1.35; margin-bottom:1.5pt;'>")
                      .append(esc(trimmed)).append("</li>");
                }
            }
            sb.append("</ul>");
        }

        return sb.toString();
    }

    private String educationBlock(Education edu) {
        StringBuilder line = new StringBuilder();

        if (notEmpty(edu.getDegree())) {
            line.append("<span style='font-weight:bold;'>")
                .append(esc(edu.getDegree())).append("</span>");
        }
        if (notEmpty(edu.getInstitution())) {
            line.append(", ").append(esc(edu.getInstitution()));
        }
        if (edu.getCgpa() != null) {
            String cgpaStr = edu.getCgpa().toString().trim();
            if (!cgpaStr.isEmpty() && !cgpaStr.equals("0") && !cgpaStr.equals("0.0")) {
                line.append(" | CGPA:").append(cgpaStr);
            }
        }

        return "<p style='font-size:9.5pt; line-height:1.35; margin-bottom:1.5pt;'>" + line + "</p>";
    }

    private String projectBlock(Project proj) {
        StringBuilder sb = new StringBuilder();
        String title = notEmpty(proj.getTitle()) ? capitalize(proj.getTitle().trim()) : "";

        sb.append("<p style='font-size:9.5pt; line-height:1.35; margin-bottom:2pt; margin-top:0;'>")
          .append("<span style='font-weight:bold;'>").append(esc(title)).append(":</span> ");

        if (notEmpty(proj.getDescription())) {
            String flat = proj.getDescription().trim()
                    .replaceAll("\n", " ")
                    .replaceAll("\\s+", " ")
                    .trim();
            sb.append(esc(flat));
        }

        sb.append("</p>");
        return sb.toString();
    }

    private String certificationsBlock(List<Certification> certs) {
        StringBuilder sb = new StringBuilder();
        sb.append("<ul style='margin-bottom:0; margin-top:0;'>");
        for (Certification cert : certs) {
            if (cert.getTitle() == null || cert.getTitle().trim().isEmpty()) continue;
            sb.append("<li style='font-size:9.5pt; line-height:1.35; margin-bottom:1.5pt;'>");
            sb.append("<span style='font-weight:bold;'>")
              .append(esc(capitalize(cert.getTitle().trim()))).append("</span>");
            String issuer = cert.getIssuer() != null ? cert.getIssuer().trim() : "";
            if (!issuer.isEmpty()) {
                sb.append(" | ").append(esc(issuer));
            }
            String date = cert.getDate() != null ? cert.getDate().trim() : "";
            if (!date.isEmpty()) {
                sb.append(" (").append(esc(formatMonthYear(date))).append(")");
            }
            sb.append("</li>");
        }
        sb.append("</ul>");
        return sb.toString();
    }

    private String formatDateRange(String start, String end) {
        String s = notEmpty(start) ? formatMonthYear(start.trim()) : "";
        String e = notEmpty(end) ? formatMonthYear(end.trim()) : "Present";
        if (s.isEmpty()) return e;
        return s + "-" + e;
    }

    private String formatMonthYear(String raw) {
        if (raw == null || raw.isBlank()) return raw;
        raw = raw.trim();
        try {
            if (raw.matches("\\d{4}-\\d{2}-\\d{2}")) {
                LocalDate d = LocalDate.parse(raw);
                return d.format(DateTimeFormatter.ofPattern("MMM yyyy"));
            }
            if (raw.matches("\\d{4}-\\d{2}")) {
                LocalDate d = LocalDate.parse(raw + "-01");
                return d.format(DateTimeFormatter.ofPattern("MMM yyyy"));
            }
        } catch (Exception ignored) {}
        return raw;
    }

    private String capitalize(String val) {
        if (val == null || val.isBlank()) return val;
        String[] words = val.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(Character.toUpperCase(word.charAt(0)));
                if (word.length() > 1) sb.append(word.substring(1));
            }
        }
        return sb.toString();
    }

    private boolean notEmpty(String val) {
        return val != null && !val.trim().isEmpty();
    }

    private String esc(String val) {
        if (val == null) return "";
        return val.replace("&", "&amp;")
                  .replace("<", "&lt;")
                  .replace(">", "&gt;")
                  .replace("\"", "&quot;");
    }
}