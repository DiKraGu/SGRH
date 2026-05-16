package com.sgrh.back.mapper;

import com.sgrh.back.dto.salaire.FichePaieDto;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.entity.FichePaie;

public class FichePaieMapper {

    public static FichePaieDto toDto(FichePaie fichePaie) {

        if (fichePaie == null) {
            return null;
        }

        return FichePaieDto.builder()
                .id(fichePaie.getId())
                .mois(fichePaie.getMois())
                .annee(fichePaie.getAnnee())
                .salaireBrut(fichePaie.getSalaireBrut())
                .primes(fichePaie.getPrimes())
                .deductions(fichePaie.getDeductions())
                .salaireNet(fichePaie.getSalaireNet())
                .employeId(
                        fichePaie.getEmploye() != null ? fichePaie.getEmploye().getId() : null
                )
                .employeNom(
                        fichePaie.getEmploye() != null ? fichePaie.getEmploye().getNom() : null
                )
                .employePrenom(
                        fichePaie.getEmploye() != null ? fichePaie.getEmploye().getPrenom() : null
                )
                .build();
    }

    public static FichePaie toEntity(FichePaieDto dto, Employe employe) {

        if (dto == null) {
            return null;
        }

        return FichePaie.builder()
                .id(dto.getId())
                .mois(dto.getMois())
                .annee(dto.getAnnee())
                .salaireBrut(dto.getSalaireBrut())
                .primes(dto.getPrimes())
                .deductions(dto.getDeductions())
                .employe(employe)
                .build();
    }
}