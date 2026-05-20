package com.example.Resume.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String skillList;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSkillList() { return skillList; }
    public void setSkillList(String skillList) { this.skillList = skillList; }
}