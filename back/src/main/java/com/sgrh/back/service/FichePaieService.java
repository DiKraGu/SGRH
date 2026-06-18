package com.sgrh.back.service;

import com.sgrh.back.dto.salaire.FichePaieDto;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.entity.FichePaie;
import com.sgrh.back.mapper.FichePaieMapper;
import com.sgrh.back.repository.EmployeRepository;
import com.sgrh.back.repository.FichePaieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FichePaieService {

    private final FichePaieRepository fichePaieRepository;
    private final EmployeRepository employeRepository;

    public List<FichePaieDto> getAllFichesPaie() {
        return fichePaieRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .map(FichePaieMapper::toDto)
                .toList();
    }

    public FichePaieDto getFichePaieById(Long id) {
        FichePaie fichePaie = fichePaieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fiche de paie introuvable"));

        return FichePaieMapper.toDto(fichePaie);
    }

    public List<FichePaieDto> getFichesByEmploye(Long employeId) {
        return fichePaieRepository.findByEmployeIdOrderByAnneeDescMoisDesc(employeId)
                .stream()
                .map(FichePaieMapper::toDto)
                .toList();
    }

    public FichePaieDto createFichePaie(FichePaieDto dto) {
        fichePaieRepository
                .findByEmployeIdAndMoisAndAnnee(dto.getEmployeId(), dto.getMois(), dto.getAnnee())
                .ifPresent(fiche -> {
                    throw new RuntimeException("Une fiche de paie existe déjà pour cet employé sur ce mois.");
                });

        Employe employe = employeRepository.findById(dto.getEmployeId())
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        BigDecimal primes = dto.getPrimes() != null ? dto.getPrimes() : BigDecimal.ZERO;
        BigDecimal deductions = dto.getDeductions() != null ? dto.getDeductions() : BigDecimal.ZERO;
        BigDecimal salaireBrut = dto.getSalaireBrut() != null
                ? dto.getSalaireBrut()
                : employe.getSalaireBase();

        BigDecimal salaireNet = salaireBrut.add(primes).subtract(deductions);

        FichePaie fichePaie = FichePaie.builder()
                .mois(dto.getMois())
                .annee(dto.getAnnee())
                .salaireBrut(salaireBrut)
                .primes(primes)
                .deductions(deductions)
                .salaireNet(salaireNet)
                .dateGeneration(LocalDate.now())
                .employe(employe)
                .build();

        FichePaie saved = fichePaieRepository.save(fichePaie);

        saved.setNumeroFiche(
                "FP-" + saved.getAnnee() + "-" + String.format("%04d", saved.getId())
        );

        return FichePaieMapper.toDto(fichePaieRepository.save(saved));
    }

    public void deleteFichePaie(Long id) {
        FichePaie fichePaie = fichePaieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fiche de paie introuvable"));

        fichePaieRepository.delete(fichePaie);
    }
}