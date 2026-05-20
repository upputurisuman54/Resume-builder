package com.example.Resume.dto;

import java.util.List;

public class ResumeRequest {

    private String fullName;
    private String phone;
    private String email;
    private String location;
    private String linkedin;
    private String github;
    private String summary;

    private List<ExperienceDto> experiences;
    private List<EducationDto> educations;
    private List<SkillDto> skills;
    private List<ProjectDto> projects;
    private List<CertificationDto> certifications;

    public static class ExperienceDto {
        private String jobTitle;
        private String company;
        private String startDate;
        private String endDate;
        private String description;

        public String getJobTitle() { return jobTitle; }
        public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }

        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }

        public String getEndDate() { return endDate; }
        public void setEndDate(String endDate) { this.endDate = endDate; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class EducationDto {
        private String degree;
        private String institution;
        private String cgpa;
        private String startYear;
        private String endYear;

        public String getDegree() { return degree; }
        public void setDegree(String degree) { this.degree = degree; }

        public String getInstitution() { return institution; }
        public void setInstitution(String institution) { this.institution = institution; }

        public String getCgpa() { return cgpa; }
        public void setCgpa(String cgpa) { this.cgpa = cgpa; }

        public String getStartYear() { return startYear; }
        public void setStartYear(String startYear) { this.startYear = startYear; }

        public String getEndYear() { return endYear; }
        public void setEndYear(String endYear) { this.endYear = endYear; }
    }

    public static class SkillDto {
        private String category;
        private String skillList;

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getSkillList() { return skillList; }
        public void setSkillList(String skillList) { this.skillList = skillList; }
    }

    public static class ProjectDto {
        private String title;
        private String description;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class CertificationDto {
        private String title;
        private String issuer;
        private String date;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getIssuer() { return issuer; }
        public void setIssuer(String issuer) { this.issuer = issuer; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<ExperienceDto> getExperiences() { return experiences; }
    public void setExperiences(List<ExperienceDto> experiences) { this.experiences = experiences; }

    public List<EducationDto> getEducations() { return educations; }
    public void setEducations(List<EducationDto> educations) { this.educations = educations; }

    public List<SkillDto> getSkills() { return skills; }
    public void setSkills(List<SkillDto> skills) { this.skills = skills; }

    public List<ProjectDto> getProjects() { return projects; }
    public void setProjects(List<ProjectDto> projects) { this.projects = projects; }

    public List<CertificationDto> getCertifications() { return certifications; }
    public void setCertifications(List<CertificationDto> certifications) { this.certifications = certifications; }
}