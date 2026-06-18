package com.sgrh.back.mapper;

import com.sgrh.back.dto.salaire.FichePaieDto;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.entity.FichePaie;

public class FichePaieMapper {

    public static FichePaieDto toDto(FichePaie fichePaie) {
        if (fichePaie == null) {
            return null;
        }

        Employe employe = fichePaie.getEmploye();

        return FichePaieDto.builder()
                .id(fichePaie.getId())
                .numeroFiche(fichePaie.getNumeroFiche())
                .mois(fichePaie.getMois())
                .annee(fichePaie.getAnnee())
                .salaireBrut(fichePaie.getSalaireBrut())
                .primes(fichePaie.getPrimes())
                .deductions(fichePaie.getDeductions())
                .salaireNet(fichePaie.getSalaireNet())
                .dateGeneration(fichePaie.getDateGeneration())
                .employeId(employe != null ? employe.getId() : null)
                .employeNom(employe != null ? employe.getNom() : null)
                .employePrenom(employe != null ? employe.getPrenom() : null)
                .employeEmail(employe != null ? employe.getEmail() : null)
                .employeTelephone(employe != null ? employe.getTelephone() : null)
                .departementNom(
                        employe != null && employe.getDepartement() != null
                                ? employe.getDepartement().getNom()
                                : null
                )
                .posteLibelle(
                        employe != null && employe.getPoste() != null
                                ? employe.getPoste().getLibelle()
                                : null
                )
                .typeContrat(
                        employe != null && employe.getTypeContrat() != null
                                ? employe.getTypeContrat().name()
                                : null
                )
                .build();
    }
}