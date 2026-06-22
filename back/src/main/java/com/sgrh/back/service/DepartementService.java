package com.sgrh.back.service;

import com.sgrh.back.dto.departement.DepartementDto;
import com.sgrh.back.entity.Departement;
import com.sgrh.back.mapper.DepartementMapper;
import com.sgrh.back.repository.DepartementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartementService {

    private final DepartementRepository departementRepository;
    private final HistoriqueActionService historiqueActionService;

    public List<DepartementDto> getAllDepartements() {
        return departementRepository.findAll()
                .stream()
                .map(DepartementMapper::toDto)
                .toList();
    }

    public DepartementDto getDepartementById(Long id) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département introuvable"));

        return DepartementMapper.toDto(departement);
    }

    public Departement getDepartementEntityById(Long id) {
        return departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département introuvable"));
    }

    public DepartementDto createDepartement(DepartementDto dto) {
        Departement departement = DepartementMapper.toEntity(dto);

        Departement saved = departementRepository.save(departement);

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Création département",
                "Création du département " + saved.getNom()
        );

        return DepartementMapper.toDto(saved);
    }

    public DepartementDto updateDepartement(Long id, DepartementDto dto) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département introuvable"));

        String ancienNom = departement.getNom();

        departement.setNom(dto.getNom());
        departement.setDescription(dto.getDescription());

        Departement saved = departementRepository.save(departement);

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Modification département",
                "Modification du département " + ancienNom + " -> " + saved.getNom()
        );

        return DepartementMapper.toDto(saved);
    }

    public void deleteDepartement(Long id) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département introuvable"));

        historiqueActionService.enregistrerAction(
                "ADMIN",
                "Suppression département",
                "Suppression du département " + departement.getNom()
        );

        departementRepository.delete(departement);
    }
}