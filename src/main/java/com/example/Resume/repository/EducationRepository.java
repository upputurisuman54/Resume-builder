package com.example.Resume.repository;

 
import com.example.Resume.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface EducationRepository extends JpaRepository<Education, Long> {
}