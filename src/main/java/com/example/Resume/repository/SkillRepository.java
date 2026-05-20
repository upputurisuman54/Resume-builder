package com.example.Resume.repository;

 
import com.example.Resume.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface SkillRepository extends JpaRepository<Skill, Long> {
}
