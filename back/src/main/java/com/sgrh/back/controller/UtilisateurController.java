package com.sgrh.back.controller;

import com.sgrh.back.dto.utilisateur.CreateUtilisateurRequest;
import com.sgrh.back.dto.utilisateur.UpdateUtilisateurRequest;
import com.sgrh.back.dto.utilisateur.UtilisateurDto;
import com.sgrh.back.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/utilisateurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    @GetMapping
    public List<UtilisateurDto> getAllUtilisateurs() {
        return utilisateurService.getAllUtilisateurs();
    }

    @PostMapping
    public UtilisateurDto createUtilisateur(@RequestBody CreateUtilisateurRequest request) {
        return utilisateurService.createUtilisateur(request);
    }

    @PutMapping("/{id}")
    public UtilisateurDto updateUtilisateur(
            @PathVariable Long id,
            @RequestBody UpdateUtilisateurRequest request
    ) {
        return utilisateurService.updateUtilisateur(id, request);
    }

    @PutMapping("/{id}/activer")
    public UtilisateurDto activerUtilisateur(@PathVariable Long id) {
        return utilisateurService.activerUtilisateur(id);
    }

    @PutMapping("/{id}/desactiver")
    public UtilisateurDto desactiverUtilisateur(@PathVariable Long id) {
        return utilisateurService.desactiverUtilisateur(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUtilisateur(@PathVariable Long id) {
        utilisateurService.deleteUtilisateur(id);
    }
}