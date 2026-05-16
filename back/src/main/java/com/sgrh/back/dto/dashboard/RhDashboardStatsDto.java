package com.sgrh.back.dto.dashboard;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RhDashboardStatsDto {

    private long employesActifs;

    private long demandesConges;

    private long offresOuvertes;

    private long candidaturesRecues;

    private long nouvellesCandidatures;
}