package com.sgrh.back.controller;

import com.sgrh.back.dto.recrutement.CandidatureDto;
import com.sgrh.back.enums.StatutCandidature;
import com.sgrh.back.service.CandidatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidatures")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CandidatureController {

    private final CandidatureService candidatureService;

    @PostMapping
    public CandidatureDto postuler(@RequestBody CandidatureDto dto) {
        return candidatureService.postuler(dto);
    }

    @GetMapping
    public List<CandidatureDto> getAllCandidatures() {
        return candidatureService.getAllCandidatures();
    }

    @GetMapping("/offre/{offreId}")
    public List<CandidatureDto> getCandidaturesByOffre(@PathVariable Long offreId) {
        return candidatureService.getCandidaturesByOffre(offreId);
    }

    @PutMapping("/{id}/statut")
    public CandidatureDto updateStatut(
            @PathVariable Long id,
            @RequestParam StatutCandidature statut
    ) {
        return candidatureService.updateStatut(id, statut);
    }
}