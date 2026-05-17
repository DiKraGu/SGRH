package com.sgrh.back.dto.employe;

import com.sgrh.back.enums.StatutEmploye;
import com.sgrh.back.enums.TypeContrat;
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
    private BigDecimal salaireBase;
    private LocalDate dateEmbauche;
    private Integer quotaAnnuelConges;
    private StatutEmploye statut;
    private TypeContrat typeContrat;
    private Long departementId;
    private String departementNom;
    private Long posteId;
    private String posteLibelle;
}