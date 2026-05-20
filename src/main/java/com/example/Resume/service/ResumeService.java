package com.example.Resume.service;


import com.example.Resume.dto.ResumeRequest;
import com.example.Resume.entity.*;
import com.example.Resume.repository.ResumeRepository;
import com.example.Resume.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Resume create(ResumeRequest req, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = new Resume();
        resume.setUser(user);
        mapFields(resume, req);
        return resumeRepository.save(resume);
    }

    public List<Resume> getMyResumes(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return resumeRepository.findByUserId(user.getId());
    }

    @Transactional
    public Resume update(Long resumeId, ResumeRequest req, String email) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Access denied");
        }

        resume.getExperiences().clear();
        resume.getEducations().clear();
        resume.getSkills().clear();
        resume.getProjects().clear();
        resume.getCertifications().clear();

        mapFields(resume, req);
        return resumeRepository.save(resume);
    }

    public void delete(Long resumeId, String email) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Access denied");
        }

        resumeRepository.delete(resume);
    }

    public Resume getById(Long resumeId, String email) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Access denied");
        }

        return resume;
    }

    private void mapFields(Resume resume, ResumeRequest req) {
        resume.setFullName(req.getFullName());
        resume.setPhone(req.getPhone());
        resume.setEmail(req.getEmail());
        resume.setLocation(req.getLocation());
        resume.setLinkedin(req.getLinkedin());
        resume.setGithub(req.getGithub());
        resume.setSummary(req.getSummary());

        if (req.getExperiences() != null) {
            for (ResumeRequest.ExperienceDto dto : req.getExperiences()) {
                Experience exp = new Experience();
                exp.setResume(resume);
                exp.setJobTitle(dto.getJobTitle());
                exp.setCompany(dto.getCompany());
                exp.setStartDate(dto.getStartDate());
                exp.setEndDate(dto.getEndDate());
                exp.setDescription(dto.getDescription());
                resume.getExperiences().add(exp);
            }
        }

        if (req.getEducations() != null) {
            for (ResumeRequest.EducationDto dto : req.getEducations()) {
                Education edu = new Education();
                edu.setResume(resume);
                edu.setDegree(dto.getDegree());
                edu.setInstitution(dto.getInstitution());
                edu.setCgpa(dto.getCgpa());
                edu.setStartYear(dto.getStartYear());
                edu.setEndYear(dto.getEndYear());
                resume.getEducations().add(edu);
            }
        }

        if (req.getSkills() != null) {
            for (ResumeRequest.SkillDto dto : req.getSkills()) {
                Skill skill = new Skill();
                skill.setResume(resume);
                skill.setCategory(dto.getCategory());
                skill.setSkillList(dto.getSkillList());
                resume.getSkills().add(skill);
            }
        }

        if (req.getProjects() != null) {
            for (ResumeRequest.ProjectDto dto : req.getProjects()) {
                Project project = new Project();
                project.setResume(resume);
                project.setTitle(dto.getTitle());
                project.setDescription(dto.getDescription());
                resume.getProjects().add(project);
            }
        }

        if (req.getCertifications() != null) {
            for (ResumeRequest.CertificationDto dto : req.getCertifications()) {
                Certification cert = new Certification();
                cert.setResume(resume);
                cert.setTitle(dto.getTitle());
                cert.setIssuer(dto.getIssuer());
                cert.setDate(dto.getDate());
                resume.getCertifications().add(cert);
            }
        }
    }
}
