package com.sgrh.back.mapper;

import com.sgrh.back.dto.poste.PosteDto;
import com.sgrh.back.entity.Poste;

public class PosteMapper {

    private PosteMapper() {
    }

    public static PosteDto toDto(Poste poste) {
        if (poste == null) {
            return null;
        }

        return PosteDto.builder()
                .id(poste.getId())
                .libelle(poste.getLibelle())
                .description(poste.getDescription())
                .departementId(
                        poste.getDepartement() != null
                                ? poste.getDepartement().getId()
                                : null
                )
                .departementNom(
                        poste.getDepartement() != null
                                ? poste.getDepartement().getNom()
                                : null
                )
                .build();
    }
}