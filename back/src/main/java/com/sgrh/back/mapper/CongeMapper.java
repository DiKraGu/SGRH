package com.sgrh.back.mapper;

import com.sgrh.back.dto.conge.CongeDto;
import com.sgrh.back.entity.Conge;
import com.sgrh.back.entity.Employe;

public class CongeMapper {

    public static CongeDto toDto(Conge conge) {

        if (conge == null) {
            return null;
        }

        return CongeDto.builder()
                .id(conge.getId())
                .dateDebut(conge.getDateDebut())
                .dateFin(conge.getDateFin())
                .nombreJours(conge.getNombreJours())
                .motif(conge.getMotif())
                .typeConge(conge.getTypeConge())
                .statut(conge.getStatut())
                .employeId(
                        conge.getEmploye() != null ?
                                conge.getEmploye().getId() : null
                )
                .employeNom(
                        conge.getEmploye() != null ?
                                conge.getEmploye().getNom() : null
                )
                .employePrenom(
                        conge.getEmploye() != null ?
                                conge.getEmploye().getPrenom() : null
                )
                .build();
    }

    public static Conge toEntity(
            CongeDto dto,
            Employe employe
    ) {

        if (dto == null) {
            return null;
        }

        return Conge.builder()
                .id(dto.getId())
                .dateDebut(dto.getDateDebut())
                .dateFin(dto.getDateFin())
                .nombreJours(dto.getNombreJours())
                .motif(dto.getMotif())
                .typeConge(dto.getTypeConge())
                .statut(dto.getStatut())
                .employe(employe)
                .build();
    }
}