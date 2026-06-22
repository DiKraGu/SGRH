package com.sgrh.back.service;

import com.sgrh.back.dto.utilisateur.UpdateProfilRequest;
import com.sgrh.back.dto.utilisateur.UtilisateurDto;
import com.sgrh.back.entity.Utilisateur;
import com.sgrh.back.mapper.UtilisateurMapper;
import com.sgrh.back.repository.UtilisateurRepository;
import com.sgrh.back.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfilService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UtilisateurDto getProfilConnecte(String authorizationHeader) {
        String email = extractEmailFromToken(authorizationHeader);

        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        return UtilisateurMapper.toDto(utilisateur);
    }

    public UtilisateurDto updateProfilConnecte(
            String authorizationHeader,
            UpdateProfilRequest request
    ) {
        String currentEmail = extractEmailFromToken(authorizationHeader);

        Utilisateur utilisateur = utilisateurRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            utilisateurRepository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(utilisateur.getId())) {
                    throw new RuntimeException("Cet email est déjà utilisé.");
                }
            });

            utilisateur.setEmail(request.getEmail());
        }

        if (
                request.getNouveauMotDePasse() != null
                        && !request.getNouveauMotDePasse().isBlank()
        ) {
            utilisateur.setMotDePasse(
                    passwordEncoder.encode(request.getNouveauMotDePasse())
            );
        }

        return UtilisateurMapper.toDto(utilisateurRepository.save(utilisateur));
    }

    private String extractEmailFromToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token invalide.");
        }

        String token = authorizationHeader.substring(7);

        return jwtService.extractUsername(token);
    }
}