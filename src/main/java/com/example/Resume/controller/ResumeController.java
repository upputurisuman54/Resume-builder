package com.example.Resume.controller;

import com.example.Resume.dto.ResumeRequest;
import com.example.Resume.entity.Resume;
import com.example.Resume.service.AiService;
import com.example.Resume.service.PdfGeneratorService;
import com.example.Resume.service.ResumeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;
    private final PdfGeneratorService pdfGeneratorService;
    private final AiService aiService;

    public ResumeController(ResumeService resumeService,
                            PdfGeneratorService pdfGeneratorService,
                            AiService aiService) {
        this.resumeService = resumeService;
        this.pdfGeneratorService = pdfGeneratorService;
        this.aiService = aiService;
    }

    @PostMapping
    public ResponseEntity<Resume> create(@RequestBody ResumeRequest req,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        Resume saved = resumeService.create(req, userDetails.getUsername());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Resume>> getMyResumes(@AuthenticationPrincipal UserDetails userDetails) {
        List<Resume> resumes = resumeService.getMyResumes(userDetails.getUsername());
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getById(@PathVariable Long id,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        Resume resume = resumeService.getById(id, userDetails.getUsername());
        return ResponseEntity.ok(resume);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resume> update(@PathVariable Long id,
                                          @RequestBody ResumeRequest req,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        Resume updated = resumeService.update(id, req, userDetails.getUsername());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        resumeService.delete(id, userDetails.getUsername());
        return ResponseEntity.ok("Resume deleted");
    }

    @PostMapping("/{id}/enhance")
    public ResponseEntity<Map<String, Object>> enhance(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(aiService.enhanceResume(id));
    }

    @PostMapping("/{id}/suggestions")
    public ResponseEntity<Map<String, Object>> suggestions(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String targetRole = body.getOrDefault("jobTitle", "Software Engineer");
        return ResponseEntity.ok(aiService.getSkillSuggestions(id, targetRole));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        Resume resume = resumeService.getById(id, userDetails.getUsername());
        byte[] pdf = pdfGeneratorService.generateResumePdf(resume);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", resume.getFullName() + "_resume.pdf");

        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}