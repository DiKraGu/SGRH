package com.sgrh.back.dto.conge;

import com.sgrh.back.enums.StatutConge;
import com.sgrh.back.enums.TypeConge;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CongeDto {

    private Long id;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private Integer nombreJours;

    private String motif;

    private TypeConge typeConge;

    private StatutConge statut;

    private Long employeId;

    private String employeNom;

    private String employePrenom;
}