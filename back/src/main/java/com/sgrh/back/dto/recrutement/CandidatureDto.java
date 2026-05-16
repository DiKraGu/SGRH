package com.sgrh.back.dto.recrutement;

import com.sgrh.back.enums.StatutCandidature;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidatureDto {

    private Long id;

    private String nom;

    private String prenom;

    private String email;

    private String telephone;

    private String lettreMotivation;

    private String cheminCV;

    private String fichiersComplementaires;

    private LocalDate dateSoumission;

    private StatutCandidature statut;

    private Long offreId;

    private String offreTitre;
}