package com.sgrh.back.dto.dashboard;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatsDto {

    private Long totalUtilisateurs;
    private Long totalEmployes;
    private Long totalRh;
    private Long totalAdmins;

    private Long employesActifs;
    private Long employesInactifs;

    private Long employesSansCompte;

    private Map<String, Long> repartitionRoles;
    private Map<String, Long> repartitionStatutEmployes;
    private Map<String, Long> repartitionDepartements;
}