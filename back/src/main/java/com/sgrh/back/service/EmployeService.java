package com.sgrh.back.service;

import com.sgrh.back.dto.employe.EmployeDto;
import com.sgrh.back.entity.Departement;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.entity.Poste;
import com.sgrh.back.entity.Utilisateur;
import com.sgrh.back.enums.StatutEmploye;
import com.sgrh.back.mapper.EmployeMapper;
import com.sgrh.back.repository.DepartementRepository;
import com.sgrh.back.repository.EmployeRepository;
import com.sgrh.back.repository.PosteRepository;
import com.sgrh.back.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeService {

    private final EmployeRepository employeRepository;
    private final DepartementRepository departementRepository;
    private final PosteRepository posteRepository;
    private final UtilisateurRepository utilisateurRepository;

    public EmployeDto createEmploye(EmployeDto dto) {
        Departement departement = departementRepository.findById(dto.getDepartementId())
                .orElseThrow(() -> new RuntimeException("Département introuvable"));

        Poste poste = posteRepository.findById(dto.getPosteId())
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));

        Employe employe = EmployeMapper.toEntity(dto, departement, poste);

        return EmployeMapper.toDto(employeRepository.save(employe));
    }

    public List<EmployeDto> getAllEmployes() {
        return employeRepository.findAll()
                .stream()
                .map(EmployeMapper::toDto)
                .toList();
    }

    public EmployeDto getEmployeById(Long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        return EmployeMapper.toDto(employe);
    }

    public EmployeDto getEmployeConnecte(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (utilisateur.getEmploye() == null) {
            throw new RuntimeException("Aucun employé lié à cet utilisateur");
        }

        return EmployeMapper.toDto(utilisateur.getEmploye());
    }

    public EmployeDto updateEmploye(Long id, EmployeDto dto) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        Departement departement = departementRepository.findById(dto.getDepartementId())
                .orElseThrow(() -> new RuntimeException("Département introuvable"));

        Poste poste = posteRepository.findById(dto.getPosteId())
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));

        employe.setNom(dto.getNom());
        employe.setPrenom(dto.getPrenom());
        employe.setEmail(dto.getEmail());
        employe.setTelephone(dto.getTelephone());
        employe.setSalaireBase(dto.getSalaireBase());
        employe.setDateEmbauche(dto.getDateEmbauche());
        employe.setQuotaAnnuelConges(dto.getQuotaAnnuelConges());
        employe.setStatut(dto.getStatut());
        employe.setTypeContrat(dto.getTypeContrat());
        employe.setDepartement(departement);
        employe.setPoste(poste);

        return EmployeMapper.toDto(employeRepository.save(employe));
    }

    public EmployeDto desactiverEmploye(Long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        employe.setStatut(StatutEmploye.INACTIF);

        return EmployeMapper.toDto(employeRepository.save(employe));
    }

    public void deleteEmploye(Long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        employeRepository.delete(employe);
    }
}