package com.sgrh.back.mapper;

import com.sgrh.back.dto.utilisateur.UtilisateurDto;
import com.sgrh.back.entity.Utilisateur;

public class UtilisateurMapper {

    public static UtilisateurDto toDto(Utilisateur utilisateur) {
        if (utilisateur == null) {
            return null;
        }

        String employeNomComplet = null;

        if (utilisateur.getEmploye() != null) {
            employeNomComplet =
                    utilisateur.getEmploye().getPrenom() + " " + utilisateur.getEmploye().getNom();
        }

        return UtilisateurDto.builder()
                .id(utilisateur.getId())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole() != null ? utilisateur.getRole().name() : null)
                .statut(utilisateur.getStatut())
                .employeId(utilisateur.getEmploye() != null ? utilisateur.getEmploye().getId() : null)
                .employeNomComplet(employeNomComplet)
                .build();
    }
}