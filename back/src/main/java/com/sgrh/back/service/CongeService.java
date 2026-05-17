package com.sgrh.back.service;

import com.sgrh.back.dto.conge.CongeDto;
import com.sgrh.back.entity.Conge;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.enums.StatutConge;
import com.sgrh.back.mapper.CongeMapper;
import com.sgrh.back.repository.CongeRepository;
import com.sgrh.back.repository.EmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CongeService {

    private final CongeRepository congeRepository;
    private final EmployeRepository employeRepository;

    public CongeDto demanderConge(CongeDto dto) {

        Employe employe = employeRepository.findById(dto.getEmployeId())
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        Conge conge = CongeMapper.toEntity(dto, employe);
        conge.setStatut(StatutConge.EN_ATTENTE);
        conge.setDateDemande(LocalDate.now());

        Conge saved = congeRepository.save(conge);

        return CongeMapper.toDto(saved);
    }

    public List<CongeDto> getAllConges() {
        return congeRepository.findAll()
                .stream()
                .map(CongeMapper::toDto)
                .toList();
    }

    public List<CongeDto> getCongesByEmploye(Long employeId) {
        return congeRepository.findByEmployeId(employeId)
                .stream()
                .map(CongeMapper::toDto)
                .toList();
    }

    public List<CongeDto> getCongesByStatut(StatutConge statut) {
        return congeRepository.findByStatut(statut)
                .stream()
                .map(CongeMapper::toDto)
                .toList();
    }

    public CongeDto validerConge(Long id) {

        Conge conge = congeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande de congé introuvable"));

        if (conge.getStatut() == StatutConge.VALIDE) {
            throw new RuntimeException("Cette demande de congé est déjà validée");
        }

        if (conge.getStatut() == StatutConge.REFUSE) {
            throw new RuntimeException("Une demande refusée ne peut pas être validée");
        }

        Employe employe = conge.getEmploye();

        if (employe == null) {
            throw new RuntimeException("Aucun employé lié à cette demande de congé");
        }

        long nombreJours = ChronoUnit.DAYS.between(
                conge.getDateDebut(),
                conge.getDateFin()
        ) + 1;

        if (nombreJours <= 0) {
            throw new RuntimeException("Les dates de congé sont invalides");
        }

        Integer quotaActuel = employe.getQuotaAnnuelConges();

        if (quotaActuel == null) {
            quotaActuel = 0;
        }

        if (quotaActuel < nombreJours) {
            throw new RuntimeException("Quota de congés insuffisant");
        }

        employe.setQuotaAnnuelConges((int) (quotaActuel - nombreJours));

        conge.setNombreJours((int) nombreJours);
        conge.setStatut(StatutConge.VALIDE);

        employeRepository.save(employe);

        Conge saved = congeRepository.save(conge);

        return CongeMapper.toDto(saved);
    }

    public CongeDto refuserConge(Long id) {

        Conge conge = congeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande de congé introuvable"));

        if (conge.getStatut() == StatutConge.VALIDE) {
            throw new RuntimeException("Une demande déjà validée ne peut pas être refusée");
        }

        conge.setStatut(StatutConge.REFUSE);

        return CongeMapper.toDto(congeRepository.save(conge));
    }

    public void annulerConge(Long id) {

        Conge conge = congeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande de congé introuvable"));

        if (conge.getStatut() != StatutConge.EN_ATTENTE) {
            throw new RuntimeException("Seule une demande en attente peut être annulée");
        }

        congeRepository.delete(conge);
    }
}