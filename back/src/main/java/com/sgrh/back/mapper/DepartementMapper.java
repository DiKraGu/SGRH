package com.sgrh.back.mapper;

import com.sgrh.back.dto.departement.DepartementDto;
import com.sgrh.back.entity.Departement;

public class DepartementMapper {

    private DepartementMapper() {
    }

    public static DepartementDto toDto(Departement departement) {
        if (departement == null) {
            return null;
        }

        return DepartementDto.builder()
                .id(departement.getId())
                .nom(departement.getNom())
                .description(departement.getDescription())
                .build();
    }

    public static Departement toEntity(DepartementDto dto) {
        if (dto == null) {
            return null;
        }

        return Departement.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .description(dto.getDescription())
                .build();
    }
}