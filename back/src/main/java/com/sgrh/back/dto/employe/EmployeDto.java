package com.sgrh.back.dto.employe;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeDto {

    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String telephone;

    private LocalDate dateEmbauche;

    private BigDecimal salaireBase;

    private Integer quotaAnnuelConges;
    private Integer quotaInitialConges;

    private String statut;
    private String typeContrat;

    private Long departementId;
    private String departementNom;

    private Long posteId;
    private String posteLibelle;
}