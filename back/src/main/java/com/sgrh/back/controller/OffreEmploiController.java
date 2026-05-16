package com.sgrh.back.controller;

import com.sgrh.back.dto.recrutement.OffreEmploiDto;
import com.sgrh.back.service.OffreEmploiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offres")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OffreEmploiController {

    private final OffreEmploiService offreEmploiService;

    @PostMapping
    public OffreEmploiDto createOffre(@RequestBody OffreEmploiDto dto) {
        return offreEmploiService.createOffre(dto);
    }

    @GetMapping
    public List<OffreEmploiDto> getAllOffres() {
        return offreEmploiService.getAllOffres();
    }

    @GetMapping("/ouvertes")
    public List<OffreEmploiDto> getOffresOuvertes() {
        return offreEmploiService.getOffresOuvertes();
    }

    @PutMapping("/{id}/fermer")
    public OffreEmploiDto fermerOffre(@PathVariable Long id) {
        return offreEmploiService.fermerOffre(id);
    }

    @DeleteMapping("/{id}")
    public void deleteOffre(@PathVariable Long id) {
        offreEmploiService.deleteOffre(id);
    }
}