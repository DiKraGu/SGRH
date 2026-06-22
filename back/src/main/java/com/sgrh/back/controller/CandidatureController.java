package com.sgrh.back.controller;

import com.sgrh.back.dto.recrutement.CandidatureDto;
import com.sgrh.back.enums.StatutCandidature;
import com.sgrh.back.service.CandidatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidatures")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CandidatureController {

    private final CandidatureService candidatureService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CandidatureDto postuler(
            @RequestParam Long offreId,
            @RequestParam String nom,
            @RequestParam String prenom,
            @RequestParam String email,
            @RequestParam String telephone,
            @RequestParam String lettreMotivation,
            @RequestParam("cv") MultipartFile cv
    ) {
        return candidatureService.postuler(
                offreId,
                nom,
                prenom,
                email,
                telephone,
                lettreMotivation,
                cv
        );
    }

    @GetMapping
    public List<CandidatureDto> getAllCandidatures() {
        return candidatureService.getAllCandidatures();
    }

    @GetMapping("/offre/{offreId}")
    public List<CandidatureDto> getCandidaturesByOffre(@PathVariable Long offreId) {
        return candidatureService.getCandidaturesByOffre(offreId);
    }

    @GetMapping("/statut")
    public List<CandidatureDto> getStatutCandidatures(@RequestParam String email) {
        return candidatureService.getCandidaturesByEmail(email);
    }

    @PutMapping("/{id}/statut")
    public CandidatureDto updateStatut(
            @PathVariable Long id,
            @RequestParam StatutCandidature statut
    ) {
        return candidatureService.updateStatut(id, statut);
    }
}