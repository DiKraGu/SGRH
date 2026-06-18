package com.sgrh.back.dto.salaire;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FichePaieDto {

    private Long id;
    private String numeroFiche;

    private Integer mois;
    private Integer annee;

    private BigDecimal salaireBrut;
    private BigDecimal primes;
    private BigDecimal deductions;
    private BigDecimal salaireNet;

    private LocalDate dateGeneration;

    private Long employeId;
    private String employeNom;
    private String employePrenom;
    private String employeEmail;
    private String employeTelephone;

    private String departementNom;
    private String posteLibelle;
    private String typeContrat;
}