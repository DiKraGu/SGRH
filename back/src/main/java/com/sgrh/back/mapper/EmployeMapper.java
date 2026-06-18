package com.sgrh.back.mapper;

import com.sgrh.back.dto.employe.EmployeDto;
import com.sgrh.back.entity.Departement;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.entity.Poste;
import com.sgrh.back.enums.StatutEmploye;
import com.sgrh.back.enums.TypeContrat;

public class EmployeMapper {

    public static EmployeDto toDto(Employe employe) {
        if (employe == null) {
            return null;
        }

        return EmployeDto.builder()
                .id(employe.getId())
                .nom(employe.getNom())
                .prenom(employe.getPrenom())
                .email(employe.getEmail())
                .telephone(employe.getTelephone())
                .dateEmbauche(employe.getDateEmbauche())
                .salaireBase(employe.getSalaireBase())
                .quotaAnnuelConges(employe.getQuotaAnnuelConges())
                .quotaInitialConges(employe.getQuotaInitialConges())
                .statut(employe.getStatut() != null ? employe.getStatut().name() : null)
                .typeContrat(employe.getTypeContrat() != null ? employe.getTypeContrat().name() : null)
                .departementId(
                        employe.getDepartement() != null ? employe.getDepartement().getId() : null
                )
                .departementNom(
                        employe.getDepartement() != null ? employe.getDepartement().getNom() : null
                )
                .posteId(
                        employe.getPoste() != null ? employe.getPoste().getId() : null
                )
                .posteLibelle(
                        employe.getPoste() != null ? employe.getPoste().getLibelle() : null
                )
                .build();
    }

    public static Employe toEntity(
            EmployeDto dto,
            Departement departement,
            Poste poste
    ) {
        if (dto == null) {
            return null;
        }

        return Employe.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .dateEmbauche(dto.getDateEmbauche())
                .salaireBase(dto.getSalaireBase())
                .quotaAnnuelConges(dto.getQuotaAnnuelConges())
                .quotaInitialConges(dto.getQuotaInitialConges())
                .statut(dto.getStatut() != null ? StatutEmploye.valueOf(dto.getStatut()) : null)
                .typeContrat(dto.getTypeContrat() != null ? TypeContrat.valueOf(dto.getTypeContrat()) : null)
                .departement(departement)
                .poste(poste)
                .build();
    }
}