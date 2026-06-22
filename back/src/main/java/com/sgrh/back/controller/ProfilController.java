package com.sgrh.back.controller;

import com.sgrh.back.dto.utilisateur.UpdateProfilRequest;
import com.sgrh.back.dto.utilisateur.UtilisateurDto;
import com.sgrh.back.service.ProfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profil")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProfilController {

    private final ProfilService profilService;

    @GetMapping("/me")
    public UtilisateurDto getProfilConnecte(@RequestHeader("Authorization") String authorizationHeader) {
        return profilService.getProfilConnecte(authorizationHeader);
    }

    @PutMapping("/me")
    public UtilisateurDto updateProfilConnecte(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody UpdateProfilRequest request
    ) {
        return profilService.updateProfilConnecte(authorizationHeader, request);
    }
}