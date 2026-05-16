package com.sgrh.back.service;

import com.sgrh.back.entity.Departement;
import com.sgrh.back.repository.DepartementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartementService {

    private final DepartementRepository departementRepository;

    public List<Departement> getAllDepartements() {
        return departementRepository.findAll();
    }

    public Departement getDepartementById(Long id) {
        return departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département introuvable"));
    }

    public Departement createDepartement(Departement departement) {
        if (departementRepository.existsByNom(departement.getNom())) {
            throw new RuntimeException("Un département avec ce nom existe déjà");
        }
        return departementRepository.save(departement);
    }

    public Departement updateDepartement(Long id, Departement details) {
        Departement departement = getDepartementById(id);

        departement.setNom(details.getNom());
        departement.setDescription(details.getDescription());
        departement.setIdResponsable(details.getIdResponsable());

        return departementRepository.save(departement);
    }

    public void deleteDepartement(Long id) {
        Departement departement = getDepartementById(id);
        departementRepository.delete(departement);
    }
}