package com.sgrh.back.service;

import com.sgrh.back.dto.utilisateur.CreateUtilisateurRequest;
import com.sgrh.back.dto.utilisateur.UpdateUtilisateurRequest;
import com.sgrh.back.dto.utilisateur.UtilisateurDto;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.entity.Utilisateur;
import com.sgrh.back.enums.Role;
import com.sgrh.back.mapper.UtilisateurMapper;
import com.sgrh.back.repository.EmployeRepository;
import com.sgrh.back.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final EmployeRepository employeRepository;
    private final PasswordEncoder passwordEncoder;
    private final HistoriqueActionService historiqueActionService;

    public List<UtilisateurDto> getAllUtilisateurs() {
        return utilisateurRepository.findAll()
                .stream()
                .map(UtilisateurMapper::toDto)
                .toList();
    }

    public UtilisateurDto createUtilisateur(CreateUtilisateurRequest request) {
        utilisateurRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà.");
        });

        Employe employe = null;

        if (request.getEmployeId() != null) {
            employe = employeRepository.findById(request.getEmployeId())
                    .orElseThrow(() -> new RuntimeException("Employé introuvable."));
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(Role.valueOf(request.getRole()))
                .statut(true)
                .employe(employe)
                .build();

        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Création utilisateur",
                "Création du compte " + savedUtilisateur.getEmail()
                        + " avec le rôle " + savedUtilisateur.getRole()
        );

        return UtilisateurMapper.toDto(savedUtilisateur);
    }

    public UtilisateurDto updateUtilisateur(Long id, UpdateUtilisateurRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        String ancienEmail = utilisateur.getEmail();
        Role ancienRole = utilisateur.getRole();
        Boolean ancienStatut = utilisateur.getStatut();

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            utilisateurRepository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(id)) {
                    throw new RuntimeException("Un autre utilisateur utilise déjà cet email.");
                }
            });

            utilisateur.setEmail(request.getEmail());
        }

        if (
                request.getNouveauMotDePasse() != null
                        && !request.getNouveauMotDePasse().isBlank()
        ) {
            utilisateur.setMotDePasse(passwordEncoder.encode(request.getNouveauMotDePasse()));
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            utilisateur.setRole(Role.valueOf(request.getRole()));
        }

        if (request.getStatut() != null) {
            utilisateur.setStatut(request.getStatut());
        }

        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);

        StringBuilder details = new StringBuilder();

        details.append("Modification du compte ")
                .append(ancienEmail)
                .append(".");

        if (!ancienEmail.equals(savedUtilisateur.getEmail())) {
            details.append(" Email : ")
                    .append(ancienEmail)
                    .append(" -> ")
                    .append(savedUtilisateur.getEmail())
                    .append(".");
        }

        if (ancienRole != savedUtilisateur.getRole()) {
            details.append(" Rôle : ")
                    .append(ancienRole)
                    .append(" -> ")
                    .append(savedUtilisateur.getRole())
                    .append(".");
        }

        if (!ancienStatut.equals(savedUtilisateur.getStatut())) {
            details.append(" Statut : ")
                    .append(ancienStatut ? "Actif" : "Inactif")
                    .append(" -> ")
                    .append(savedUtilisateur.getStatut() ? "Actif" : "Inactif")
                    .append(".");
        }

        if (
                request.getNouveauMotDePasse() != null
                        && !request.getNouveauMotDePasse().isBlank()
        ) {
            details.append(" Mot de passe réinitialisé.");
        }

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Modification utilisateur",
                details.toString()
        );

        return UtilisateurMapper.toDto(savedUtilisateur);
    }

    public UtilisateurDto activerUtilisateur(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        utilisateur.setStatut(true);

        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Activation utilisateur",
                "Activation du compte " + savedUtilisateur.getEmail()
        );

        return UtilisateurMapper.toDto(savedUtilisateur);
    }

    public UtilisateurDto desactiverUtilisateur(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        utilisateur.setStatut(false);

        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Désactivation utilisateur",
                "Désactivation du compte " + savedUtilisateur.getEmail()
        );

        return UtilisateurMapper.toDto(savedUtilisateur);
    }

    public void deleteUtilisateur(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Suppression utilisateur",
                "Suppression du compte " + utilisateur.getEmail()
                        + " avec le rôle " + utilisateur.getRole()
        );

        utilisateurRepository.delete(utilisateur);
    }
}