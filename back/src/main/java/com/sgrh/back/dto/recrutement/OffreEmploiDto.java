package com.sgrh.back.dto.recrutement;

import com.sgrh.back.enums.StatutOffre;
import com.sgrh.back.enums.TypeContrat;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OffreEmploiDto {

    private Long id;

    private String titre;

    private String description;

    private Double salairePropose;

    private LocalDate dateLimite;

    private LocalDate datePublication;

    private StatutOffre statut;

    private TypeContrat typeContrat;

    private Long departementId;

    private String departementNom;

    private Long posteId;

    private String posteLibelle;
}