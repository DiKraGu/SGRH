package com.sgrh.back.mapper;

import com.sgrh.back.dto.recrutement.CandidatureDto;
import com.sgrh.back.entity.Candidature;
import com.sgrh.back.entity.OffreEmploi;

public class CandidatureMapper {

    public static CandidatureDto toDto(Candidature candidature) {

        if (candidature == null) {
            return null;
        }

        return CandidatureDto.builder()
                .id(candidature.getId())
                .nom(candidature.getNom())
                .prenom(candidature.getPrenom())
                .email(candidature.getEmail())
                .telephone(candidature.getTelephone())
                .lettreMotivation(candidature.getLettreMotivation())
                .cheminCV(candidature.getCheminCV())
                .dateSoumission(candidature.getDateSoumission())
                .statut(candidature.getStatut())
                .offreId(candidature.getOffre() != null ? candidature.getOffre().getId() : null)
                .offreTitre(candidature.getOffre() != null ? candidature.getOffre().getTitre() : null)
                .build();
    }

    public static Candidature toEntity(
            CandidatureDto dto,
            OffreEmploi offre
    ) {

        if (dto == null) {
            return null;
        }

        return Candidature.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .lettreMotivation(dto.getLettreMotivation())
                .cheminCV(dto.getCheminCV())
                .dateSoumission(dto.getDateSoumission())
                .statut(dto.getStatut())
                .offre(offre)
                .build();
    }
}