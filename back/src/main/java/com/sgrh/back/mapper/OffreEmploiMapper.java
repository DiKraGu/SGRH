package com.sgrh.back.mapper;

import com.sgrh.back.dto.recrutement.OffreEmploiDto;
import com.sgrh.back.entity.Departement;
import com.sgrh.back.entity.OffreEmploi;
import com.sgrh.back.entity.Poste;

public class OffreEmploiMapper {

    public static OffreEmploiDto toDto(OffreEmploi offre) {

        if (offre == null) {
            return null;
        }

        return OffreEmploiDto.builder()
                .id(offre.getId())
                .titre(offre.getTitre())
                .description(offre.getDescription())
                .salairePropose(offre.getSalairePropose())
                .dateLimite(offre.getDateLimite())
                .datePublication(offre.getDatePublication())
                .statut(offre.getStatut())
                .typeContrat(offre.getTypeContrat())
                .departementId(offre.getDepartement() != null ? offre.getDepartement().getId() : null)
                .departementNom(offre.getDepartement() != null ? offre.getDepartement().getNom() : null)
                .posteId(offre.getPoste() != null ? offre.getPoste().getId() : null)
                .posteLibelle(offre.getPoste() != null ? offre.getPoste().getLibelle() : null)
                .build();
    }

    public static OffreEmploi toEntity(
            OffreEmploiDto dto,
            Departement departement,
            Poste poste
    ) {

        if (dto == null) {
            return null;
        }

        return OffreEmploi.builder()
                .id(dto.getId())
                .titre(dto.getTitre())
                .description(dto.getDescription())
                .salairePropose(dto.getSalairePropose())
                .dateLimite(dto.getDateLimite())
                .datePublication(dto.getDatePublication())
                .statut(dto.getStatut())
                .typeContrat(dto.getTypeContrat())
                .departement(departement)
                .poste(poste)
                .build();
    }
}