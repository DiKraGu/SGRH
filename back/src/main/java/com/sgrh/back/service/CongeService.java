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

        conge.setStatut(StatutConge.VALIDE);

        return CongeMapper.toDto(congeRepository.save(conge));
    }

    public CongeDto refuserConge(Long id) {

        Conge conge = congeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande de congé introuvable"));

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