package com.sgrh.back.service;

import com.sgrh.back.dto.utilisateur.CreateUtilisateurRequest;
import com.sgrh.back.dto.utilisateur.UpdateUtilisateurRequest;
import com.sgrh.back.dto.utilisateur.UtilisateurDto;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.entity.Utilisateur;
import com.sgrh.back.enums.Role;
import com.sgrh.back.enums.StatutEmploye;
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

            utilisateurRepository.findByEmployeId(employe.getId()).ifPresent(user -> {
                throw new RuntimeException("Cet employé possède déjà un compte utilisateur.");
            });
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(Role.valueOf(request.getRole()))
                .statut(true)
                .employe(employe)
                .build();

        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);

        if (employe != null) {
            employe.setStatut(StatutEmploye.ACTIF);
            employeRepository.save(employe);
        }

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Création utilisateur",
                "Création du compte " + savedUtilisateur.getEmail()
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

        if (request.getNouveauMotDePasse() != null && !request.getNouveauMotDePasse().isBlank()) {
            utilisateur.setMotDePasse(passwordEncoder.encode(request.getNouveauMotDePasse()));
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            utilisateur.setRole(Role.valueOf(request.getRole()));
        }

        if (request.getStatut() != null) {
            utilisateur.setStatut(request.getStatut());
        }

        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);


        synchroniserFicheEmploye(savedUtilisateur);

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Modification utilisateur",
                "Modification du compte " + ancienEmail
                        + ". Rôle : " + ancienRole + " -> " + savedUtilisateur.getRole()
                        + ". Statut : " + (ancienStatut ? "Actif" : "Inactif")
                        + " -> " + (savedUtilisateur.getStatut() ? "Actif" : "Inactif")
        );

        return UtilisateurMapper.toDto(savedUtilisateur);
    }

    public UtilisateurDto activerUtilisateur(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        utilisateur.setStatut(true);

        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);

        synchroniserFicheEmploye(savedUtilisateur);

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

        synchroniserFicheEmploye(savedUtilisateur);

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

        if (utilisateur.getEmploye() != null) {
            Employe employe = utilisateur.getEmploye();
            employe.setStatut(StatutEmploye.INACTIF);
            employeRepository.save(employe);
        }

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Suppression utilisateur",
                "Suppression du compte " + utilisateur.getEmail()
        );

        utilisateurRepository.delete(utilisateur);
    }

    private void synchroniserFicheEmploye(Utilisateur utilisateur) {
        if (utilisateur.getEmploye() == null) {
            return;
        }

        Employe employe = utilisateur.getEmploye();

        if (Boolean.TRUE.equals(utilisateur.getStatut())) {
            employe.setStatut(StatutEmploye.ACTIF);
        } else {
            employe.setStatut(StatutEmploye.INACTIF);
        }

        employeRepository.save(employe);
    }


}