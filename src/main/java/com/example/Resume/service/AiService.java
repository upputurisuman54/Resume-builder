package com.example.Resume.service;

import com.example.Resume.entity.Experience;
import com.example.Resume.entity.Resume;
import com.example.Resume.entity.Skill;
import com.example.Resume.repository.ResumeRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiService {

    private final ResumeRepository resumeRepository;

    public AiService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    public Map<String, Object> enhanceResume(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        String enhanced = buildEnhancedSummary(resume);
        List<String> bullets = buildBulletPoints(resume);

        Map<String, Object> result = new HashMap<>();
        result.put("enhancedSummary", enhanced);
        result.put("bulletPoints", bullets);
        result.put("improvements", "Summary rewritten with stronger action verbs and quantified achievements.");
        return result;
    }

    public Map<String, Object> getSkillSuggestions(Long resumeId, String targetRole) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        List<String> currentSkills = extractSkillNames(resume.getSkills());
        List<String> missing = suggestMissingSkills(targetRole, currentSkills);
        List<String> certs = suggestCertifications(targetRole);
        String salary = estimateSalary(targetRole);
        String advice = buildAdvice(resume.getFullName(), targetRole, currentSkills.size());

        Map<String, Object> result = new HashMap<>();
        result.put("missingSkills", missing);
        result.put("certifications", certs);
        result.put("salaryRange", salary);
        result.put("advice", advice);
        return result;
    }

    private String buildEnhancedSummary(Resume resume) {
        String name = resume.getFullName() != null ? resume.getFullName() : "The candidate";
        String skillSummary = extractSkillNames(resume.getSkills()).stream()
                .limit(4)
                .collect(Collectors.joining(", "));
        int years = resume.getExperiences() != null ? resume.getExperiences().size() : 0;
        String expText = years > 0 ? years + "+ years of hands-on experience" : "a strong foundation";

        String base = name + " is a results-driven professional with " + expText
                + " in software development.";

        if (!skillSummary.isEmpty()) {
            base += " Proficient in " + skillSummary
                    + ", with a proven track record of delivering scalable and maintainable solutions.";
        }

        if (resume.getExperiences() != null && !resume.getExperiences().isEmpty()) {
            Experience latest = resume.getExperiences().get(0);
            if (latest.getCompany() != null && !latest.getCompany().isBlank()) {
                base += " Most recently contributed to " + latest.getCompany()
                        + " as " + (latest.getJobTitle() != null ? latest.getJobTitle() : "a key team member") + ".";
            }
        }

        base += " Passionate about clean code, continuous learning, and building impactful products.";
        return base;
    }

    private List<String> buildBulletPoints(Resume resume) {
        List<String> bullets = new ArrayList<>();
        List<String> skills = extractSkillNames(resume.getSkills());

        if (resume.getExperiences() != null) {
            for (Experience exp : resume.getExperiences()) {
                if (exp.getDescription() != null && !exp.getDescription().isBlank()) {
                    bullets.add("Led key initiatives at " + (exp.getCompany() != null ? exp.getCompany() : "the organization")
                            + " — " + exp.getDescription().trim());
                }
            }
        }

        if (!skills.isEmpty()) {
            bullets.add("Delivered production-grade solutions using " + String.join(", ", skills.subList(0, Math.min(3, skills.size()))) + ".");
        }

        bullets.add("Collaborated with cross-functional teams to define requirements and ship features on schedule.");
        bullets.add("Improved code quality and reduced technical debt through consistent code reviews and refactoring.");
        bullets.add("Wrote unit and integration tests to ensure reliability and reduce regression bugs.");

        return bullets.stream().limit(6).collect(Collectors.toList());
    }

    private List<String> extractSkillNames(List<Skill> skills) {
        if (skills == null) return new ArrayList<>();
        return skills.stream()
                .map(s -> s.getSkillList() != null ? s.getSkillList() : "")
                .filter(s -> !s.isBlank())
                .flatMap(s -> Arrays.stream(s.split(",")))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private List<String> suggestMissingSkills(String targetRole, List<String> current) {
        Map<String, List<String>> roleSkills = new LinkedHashMap<>();
        roleSkills.put("backend", List.of("Spring Boot", "Microservices", "Docker", "Kafka", "Redis", "PostgreSQL", "REST API", "JUnit"));
        roleSkills.put("frontend", List.of("React", "TypeScript", "Redux", "Webpack", "CSS Modules", "Jest", "GraphQL", "Next.js"));
        roleSkills.put("fullstack", List.of("Spring Boot", "React", "Docker", "MySQL", "REST API", "TypeScript", "Redis", "CI/CD"));
        roleSkills.put("devops", List.of("Docker", "Kubernetes", "Jenkins", "Terraform", "AWS", "Linux", "Ansible", "Prometheus"));
        roleSkills.put("data", List.of("Python", "Pandas", "SQL", "Spark", "Machine Learning", "Tableau", "Airflow", "NumPy"));
        roleSkills.put("default", List.of("Docker", "Kubernetes", "CI/CD", "REST API", "Microservices", "Redis", "System Design", "AWS"));

        String key = "default";
        String role = targetRole.toLowerCase();
        if (role.contains("backend") || role.contains("java") || role.contains("spring")) key = "backend";
        else if (role.contains("frontend") || role.contains("react") || role.contains("ui")) key = "frontend";
        else if (role.contains("fullstack") || role.contains("full stack") || role.contains("full-stack")) key = "fullstack";
        else if (role.contains("devops") || role.contains("cloud") || role.contains("infrastructure")) key = "devops";
        else if (role.contains("data") || role.contains("analyst") || role.contains("ml")) key = "data";

        List<String> lowerCurrent = current.stream().map(String::toLowerCase).collect(Collectors.toList());

        return roleSkills.get(key).stream()
                .filter(s -> !lowerCurrent.contains(s.toLowerCase()))
                .limit(6)
                .collect(Collectors.toList());
    }

    private List<String> suggestCertifications(String targetRole) {
        String role = targetRole.toLowerCase();
        if (role.contains("aws") || role.contains("cloud") || role.contains("devops"))
            return List.of("AWS Certified Developer – Associate", "AWS Solutions Architect", "Docker Certified Associate");
        if (role.contains("java") || role.contains("spring") || role.contains("backend"))
            return List.of("Oracle Certified Java Professional", "Spring Professional Certification", "AWS Certified Developer");
        if (role.contains("data") || role.contains("ml") || role.contains("analyst"))
            return List.of("Google Data Analytics Certificate", "IBM Data Science Professional", "AWS Machine Learning Specialty");
        return List.of("AWS Certified Developer – Associate", "Oracle Certified Java Professional", "Scrum Master Certification");
    }

    private String estimateSalary(String targetRole) {
        String role = targetRole.toLowerCase();
        if (role.contains("senior") || role.contains("lead") || role.contains("architect"))
            return "₹18,00,000 – ₹35,00,000 per year";
        if (role.contains("junior") || role.contains("fresher") || role.contains("entry"))
            return "₹4,00,000 – ₹8,00,000 per year";
        return "₹8,00,000 – ₹18,00,000 per year";
    }

    private String buildAdvice(String name, String targetRole, int skillCount) {
        String advice = name + ", to land a " + targetRole + " role, focus on building 2-3 portfolio projects that demonstrate the missing skills above. ";
        if (skillCount < 5) {
            advice += "Your skill set is still growing — prioritize the top 3 missing skills and get hands-on with them through personal projects. ";
        } else {
            advice += "You already have a solid skill base — now focus on system design knowledge and contributing to open source. ";
        }
        advice += "Getting one relevant certification will significantly strengthen your profile.";
        return advice;
    }
}