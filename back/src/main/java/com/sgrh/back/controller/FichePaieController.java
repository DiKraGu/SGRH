package com.sgrh.back.controller;

import com.sgrh.back.dto.salaire.FichePaieDto;
import com.sgrh.back.service.FichePaieService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fiches-paie")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FichePaieController {

    private final FichePaieService fichePaieService;

    @GetMapping
    public List<FichePaieDto> getAllFichesPaie() {
        return fichePaieService.getAllFichesPaie();
    }

    @GetMapping("/{id}")
    public FichePaieDto getFichePaieById(@PathVariable Long id) {
        return fichePaieService.getFichePaieById(id);
    }

    @GetMapping("/employe/{employeId}")
    public List<FichePaieDto> getFichesByEmploye(@PathVariable Long employeId) {
        return fichePaieService.getFichesByEmploye(employeId);
    }

    @PostMapping
    public FichePaieDto createFichePaie(@RequestBody FichePaieDto dto) {
        return fichePaieService.createFichePaie(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteFichePaie(@PathVariable Long id) {
        fichePaieService.deleteFichePaie(id);
    }
}