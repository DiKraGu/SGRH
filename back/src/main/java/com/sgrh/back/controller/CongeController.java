package com.sgrh.back.controller;

import com.sgrh.back.dto.conge.CongeDto;
import com.sgrh.back.enums.StatutConge;
import com.sgrh.back.service.CongeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conges")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CongeController {

    private final CongeService congeService;

    @PostMapping
    public CongeDto demanderConge(@RequestBody CongeDto dto) {
        return congeService.demanderConge(dto);
    }

    @GetMapping
    public List<CongeDto> getAllConges() {
        return congeService.getAllConges();
    }

    @GetMapping("/employe/{employeId}")
    public List<CongeDto> getCongesByEmploye(@PathVariable Long employeId) {
        return congeService.getCongesByEmploye(employeId);
    }

    @GetMapping("/statut/{statut}")
    public List<CongeDto> getCongesByStatut(@PathVariable StatutConge statut) {
        return congeService.getCongesByStatut(statut);
    }

    @PutMapping("/{id}/valider")
    public CongeDto validerConge(@PathVariable Long id) {
        return congeService.validerConge(id);
    }

    @PutMapping("/{id}/refuser")
    public CongeDto refuserConge(@PathVariable Long id) {
        return congeService.refuserConge(id);
    }

    @DeleteMapping("/{id}/annuler")
    public void annulerConge(@PathVariable Long id) {
        congeService.annulerConge(id);
    }
}