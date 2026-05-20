package com.example.Resume.repository;
 
import com.example.Resume.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
 
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserId(Long userId);
}
