package com.sgrh.back.service;

import com.sgrh.back.dto.poste.PosteDto;
import com.sgrh.back.entity.Departement;
import com.sgrh.back.entity.Poste;
import com.sgrh.back.mapper.PosteMapper;
import com.sgrh.back.repository.DepartementRepository;
import com.sgrh.back.repository.PosteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PosteService {

    private final PosteRepository posteRepository;
    private final DepartementRepository departementRepository;
    private final HistoriqueActionService historiqueActionService;

    public List<PosteDto> getAllPostes() {
        return posteRepository.findAll()
                .stream()
                .map(PosteMapper::toDto)
                .toList();
    }

    public List<PosteDto> getPostesByDepartement(Long departementId) {
        return posteRepository.findByDepartementId(departementId)
                .stream()
                .map(PosteMapper::toDto)
                .toList();
    }

    public PosteDto getPosteById(Long id) {
        Poste poste = posteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));

        return PosteMapper.toDto(poste);
    }

    public Poste getPosteEntityById(Long id) {
        return posteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));
    }

    public PosteDto createPoste(PosteDto dto) {
        Departement departement = departementRepository.findById(dto.getDepartementId())
                .orElseThrow(() -> new RuntimeException("Département introuvable"));

        Poste poste = Poste.builder()
                .libelle(dto.getLibelle())
                .description(dto.getDescription())
                .departement(departement)
                .build();

        Poste saved = posteRepository.save(poste);

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Création poste",
                "Création du poste " + saved.getLibelle()
                        + " dans le département " + departement.getNom()
        );

        return PosteMapper.toDto(saved);
    }

    public PosteDto updatePoste(Long id, PosteDto dto) {
        Poste poste = posteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));

        Departement departement = departementRepository.findById(dto.getDepartementId())
                .orElseThrow(() -> new RuntimeException("Département introuvable"));

        String ancienLibelle = poste.getLibelle();

        poste.setLibelle(dto.getLibelle());
        poste.setDescription(dto.getDescription());
        poste.setDepartement(departement);

        Poste saved = posteRepository.save(poste);

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Modification poste",
                "Modification du poste " + ancienLibelle + " -> " + saved.getLibelle()
        );

        return PosteMapper.toDto(saved);
    }

    public void deletePoste(Long id) {
        Poste poste = posteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Suppression poste",
                "Suppression du poste " + poste.getLibelle()
        );

        posteRepository.delete(poste);
    }
}