package com.sgrh.back.service;

import com.sgrh.back.dto.recrutement.CandidatureDto;
import com.sgrh.back.entity.Candidature;
import com.sgrh.back.entity.OffreEmploi;
import com.sgrh.back.enums.StatutCandidature;
import com.sgrh.back.enums.StatutOffre;
import com.sgrh.back.mapper.CandidatureMapper;
import com.sgrh.back.repository.CandidatureRepository;
import com.sgrh.back.repository.OffreEmploiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final OffreEmploiRepository offreEmploiRepository;

    public CandidatureDto postuler(CandidatureDto dto) {

        OffreEmploi offre = offreEmploiRepository.findById(dto.getOffreId())
                .orElseThrow(() -> new RuntimeException("Offre introuvable"));

        if (offre.getStatut() == StatutOffre.FERMEE) {
            throw new RuntimeException("Cette offre est fermée");
        }

        if (offre.getDateLimite() != null && offre.getDateLimite().isBefore(LocalDate.now())) {
            throw new RuntimeException("La date limite de candidature est dépassée");
        }

        if (candidatureRepository.existsByEmailAndOffreId(dto.getEmail(), dto.getOffreId())) {
            throw new RuntimeException("Vous avez déjà postulé à cette offre");
        }

        Candidature candidature = CandidatureMapper.toEntity(dto, offre);
        candidature.setDateSoumission(LocalDate.now());
        candidature.setStatut(StatutCandidature.RECUE);

        return CandidatureMapper.toDto(candidatureRepository.save(candidature));
    }

    public List<CandidatureDto> getAllCandidatures() {
        return candidatureRepository.findAll()
                .stream()
                .map(CandidatureMapper::toDto)
                .toList();
    }

    public List<CandidatureDto> getCandidaturesByOffre(Long offreId) {
        return candidatureRepository.findByOffreId(offreId)
                .stream()
                .map(CandidatureMapper::toDto)
                .toList();
    }

    public CandidatureDto updateStatut(Long id, StatutCandidature statut) {
        Candidature candidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));

        candidature.setStatut(statut);

        return CandidatureMapper.toDto(candidatureRepository.save(candidature));
    }
}