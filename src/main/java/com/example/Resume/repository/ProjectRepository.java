package com.example.Resume.repository;


 
import com.example.Resume.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
