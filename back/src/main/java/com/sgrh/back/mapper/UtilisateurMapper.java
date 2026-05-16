package com.sgrh.back.mapper;

import com.sgrh.back.dto.auth.UtilisateurDto;
import com.sgrh.back.entity.Utilisateur;

public class UtilisateurMapper {

    public static UtilisateurDto toDto(Utilisateur utilisateur) {
        if (utilisateur == null) {
            return null;
        }

        return UtilisateurDto.builder()
                .id(utilisateur.getId())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole())
                .statut(utilisateur.getStatut())
                .employeId(utilisateur.getEmploye() != null ? utilisateur.getEmploye().getId() : null)
                .build();
    }
}