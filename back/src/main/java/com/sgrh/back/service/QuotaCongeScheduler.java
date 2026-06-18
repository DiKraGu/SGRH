package com.sgrh.back.service;

import com.sgrh.back.entity.Employe;
import com.sgrh.back.enums.StatutEmploye;
import com.sgrh.back.repository.EmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuotaCongeScheduler {

    private final EmployeRepository employeRepository;

    @Scheduled(cron = "0 0 0 1 1 *")
    public void regenererQuotasCongesAnnuels() {
        List<Employe> employes = employeRepository.findAll();

        for (Employe employe : employes) {
            if (employe.getStatut() == StatutEmploye.ACTIF) {
                Integer quotaInitial = employe.getQuotaInitialConges();

                if (quotaInitial == null) {
                    quotaInitial = employe.getQuotaAnnuelConges();
                }

                employe.setQuotaAnnuelConges(quotaInitial);
            }
        }

        employeRepository.saveAll(employes);
    }
}