package com.sgrh.back.service;

import com.sgrh.back.dto.recrutement.OffreEmploiDto;
import com.sgrh.back.entity.Departement;
import com.sgrh.back.entity.OffreEmploi;
import com.sgrh.back.entity.Poste;
import com.sgrh.back.enums.StatutOffre;
import com.sgrh.back.mapper.OffreEmploiMapper;
import com.sgrh.back.repository.DepartementRepository;
import com.sgrh.back.repository.OffreEmploiRepository;
import com.sgrh.back.repository.PosteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OffreEmploiService {

    private final OffreEmploiRepository offreEmploiRepository;
    private final DepartementRepository departementRepository;
    private final PosteRepository posteRepository;

    public OffreEmploiDto createOffre(OffreEmploiDto dto) {

        Departement departement = departementRepository.findById(dto.getDepartementId())
                .orElseThrow(() -> new RuntimeException("Département introuvable"));

        Poste poste = posteRepository.findById(dto.getPosteId())
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));

        OffreEmploi offre = OffreEmploiMapper.toEntity(dto, departement, poste);

        offre.setDatePublication(LocalDate.now());

        if (offre.getStatut() == null) {
            offre.setStatut(StatutOffre.OUVERTE);
        }

        return OffreEmploiMapper.toDto(offreEmploiRepository.save(offre));
    }

    public List<OffreEmploiDto> getAllOffres() {
        return offreEmploiRepository.findAll()
                .stream()
                .map(OffreEmploiMapper::toDto)
                .toList();
    }

    public List<OffreEmploiDto> getOffresOuvertes() {
        return offreEmploiRepository.findByStatut(StatutOffre.OUVERTE)
                .stream()
                .map(OffreEmploiMapper::toDto)
                .toList();
    }

    public OffreEmploiDto fermerOffre(Long id) {
        OffreEmploi offre = offreEmploiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre introuvable"));

        offre.setStatut(StatutOffre.FERMEE);

        return OffreEmploiMapper.toDto(offreEmploiRepository.save(offre));
    }

    public void deleteOffre(Long id) {
        OffreEmploi offre = offreEmploiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre introuvable"));

        offreEmploiRepository.delete(offre);
    }
}