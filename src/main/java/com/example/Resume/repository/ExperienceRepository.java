package com.example.Resume.repository;

 
import com.example.Resume.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
}
