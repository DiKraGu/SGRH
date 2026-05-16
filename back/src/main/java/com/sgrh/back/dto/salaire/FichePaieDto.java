package com.sgrh.back.dto.salaire;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FichePaieDto {

    private Long id;

    private Integer mois;

    private Integer annee;

    private Double salaireBrut;

    private Double primes;

    private Double deductions;

    private Double salaireNet;

    private Long employeId;

    private String employeNom;

    private String employePrenom;
}