package com.sgrh.back.service;

import com.sgrh.back.dto.dashboard.RhDashboardStatsDto;
import com.sgrh.back.enums.StatutCandidature;
import com.sgrh.back.enums.StatutConge;
import com.sgrh.back.enums.StatutEmploye;
import com.sgrh.back.enums.StatutOffre;
import com.sgrh.back.repository.CandidatureRepository;
import com.sgrh.back.repository.CongeRepository;
import com.sgrh.back.repository.EmployeRepository;
import com.sgrh.back.repository.OffreEmploiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmployeRepository employeRepository;
    private final CongeRepository congeRepository;
    private final OffreEmploiRepository offreEmploiRepository;
    private final CandidatureRepository candidatureRepository;

    public RhDashboardStatsDto getRhStats() {

        return RhDashboardStatsDto.builder()
                .employesActifs(employeRepository.countByStatut(StatutEmploye.ACTIF))
                .demandesConges(congeRepository.countByStatut(StatutConge.EN_ATTENTE))
                .offresOuvertes(offreEmploiRepository.countByStatut(StatutOffre.OUVERTE))
                .candidaturesRecues(candidatureRepository.count())
                .nouvellesCandidatures(candidatureRepository.countByStatut(StatutCandidature.RECUE))
                .build();
    }
}