package com.sgrh.back.service;

import com.sgrh.back.dto.salaire.FichePaieDto;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.entity.FichePaie;
import com.sgrh.back.mapper.FichePaieMapper;
import com.sgrh.back.repository.EmployeRepository;
import com.sgrh.back.repository.FichePaieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FichePaieService {

    private final FichePaieRepository fichePaieRepository;
    private final EmployeRepository employeRepository;

    public FichePaieDto createFichePaie(FichePaieDto dto) {

        if (fichePaieRepository.findByEmployeIdAndMoisAndAnnee(
                dto.getEmployeId(),
                dto.getMois(),
                dto.getAnnee()
        ).isPresent()) {
            throw new RuntimeException("Une fiche de paie existe déjà pour cet employé sur ce mois/année");
        }

        Employe employe = employeRepository.findById(dto.getEmployeId())
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        FichePaie fichePaie = FichePaieMapper.toEntity(dto, employe);

        FichePaie saved = fichePaieRepository.save(fichePaie);

        return FichePaieMapper.toDto(saved);
    }

    public List<FichePaieDto> getAllFichesPaie() {
        return fichePaieRepository.findAll()
                .stream()
                .map(FichePaieMapper::toDto)
                .toList();
    }

    public List<FichePaieDto> getFichesByEmploye(Long employeId) {
        return fichePaieRepository.findByEmployeId(employeId)
                .stream()
                .map(FichePaieMapper::toDto)
                .toList();
    }

    public FichePaieDto getFicheById(Long id) {
        FichePaie fichePaie = fichePaieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fiche de paie introuvable"));

        return FichePaieMapper.toDto(fichePaie);
    }

    public void deleteFichePaie(Long id) {
        FichePaie fichePaie = fichePaieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fiche de paie introuvable"));

        fichePaieRepository.delete(fichePaie);
    }
}