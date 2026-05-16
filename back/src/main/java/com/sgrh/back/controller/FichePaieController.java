package com.sgrh.back.controller;

import com.sgrh.back.dto.salaire.FichePaieDto;
import com.sgrh.back.service.FichePaieService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fiches-paie")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FichePaieController {

    private final FichePaieService fichePaieService;

    @PostMapping
    public FichePaieDto createFichePaie(@RequestBody FichePaieDto dto) {
        return fichePaieService.createFichePaie(dto);
    }

    @GetMapping
    public List<FichePaieDto> getAllFichesPaie() {
        return fichePaieService.getAllFichesPaie();
    }

    @GetMapping("/{id}")
    public FichePaieDto getFicheById(@PathVariable Long id) {
        return fichePaieService.getFicheById(id);
    }

    @GetMapping("/employe/{employeId}")
    public List<FichePaieDto> getFichesByEmploye(@PathVariable Long employeId) {
        return fichePaieService.getFichesByEmploye(employeId);
    }

    @DeleteMapping("/{id}")
    public void deleteFichePaie(@PathVariable Long id) {
        fichePaieService.deleteFichePaie(id);
    }
}