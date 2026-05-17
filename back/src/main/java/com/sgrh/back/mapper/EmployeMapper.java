package com.sgrh.back.mapper;

import com.sgrh.back.dto.employe.EmployeDto;
import com.sgrh.back.entity.Departement;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.entity.Poste;

public class EmployeMapper {

    public static EmployeDto toDto(Employe employe) {
        if (employe == null) {
            return null;
        }

        String emailAffiche = employe.getEmail();

        if ((emailAffiche == null || emailAffiche.isBlank()) && employe.getUtilisateur() != null) {
            emailAffiche = employe.getUtilisateur().getEmail();
        }

        return EmployeDto.builder()
                .id(employe.getId())
                .nom(employe.getNom())
                .prenom(employe.getPrenom())
                .email(emailAffiche)
                .telephone(employe.getTelephone())
                .salaireBase(employe.getSalaireBase())
                .dateEmbauche(employe.getDateEmbauche())
                .quotaAnnuelConges(employe.getQuotaAnnuelConges())
                .statut(employe.getStatut())
                .typeContrat(employe.getTypeContrat())
                .departementId(employe.getDepartement() != null ? employe.getDepartement().getId() : null)
                .departementNom(employe.getDepartement() != null ? employe.getDepartement().getNom() : null)
                .posteId(employe.getPoste() != null ? employe.getPoste().getId() : null)
                .posteLibelle(employe.getPoste() != null ? employe.getPoste().getLibelle() : null)
                .build();
    }

    public static Employe toEntity(EmployeDto dto, Departement departement, Poste poste) {
        if (dto == null) {
            return null;
        }

        return Employe.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .salaireBase(dto.getSalaireBase())
                .dateEmbauche(dto.getDateEmbauche())
                .quotaAnnuelConges(dto.getQuotaAnnuelConges())
                .statut(dto.getStatut())
                .typeContrat(dto.getTypeContrat())
                .departement(departement)
                .poste(poste)
                .build();
    }
}