package com.sgrh.back.service;

import com.sgrh.back.dto.employe.EmployeDto;
import com.sgrh.back.entity.Departement;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.entity.Poste;
import com.sgrh.back.entity.Utilisateur;
import com.sgrh.back.enums.StatutEmploye;
import com.sgrh.back.enums.TypeContrat;
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
    private final HistoriqueActionService historiqueActionService;

    public EmployeDto createEmploye(EmployeDto dto) {
        Departement departement = departementRepository.findById(dto.getDepartementId())
                .orElseThrow(() -> new RuntimeException("Département introuvable"));

        Poste poste = posteRepository.findById(dto.getPosteId())
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));

        Employe employe = EmployeMapper.toEntity(dto, departement, poste);

        if (employe.getQuotaInitialConges() == null) {
            employe.setQuotaInitialConges(employe.getQuotaAnnuelConges());
        }

        validateDateFinContrat(employe);

        Employe savedEmploye = employeRepository.save(employe);

        historiqueActionService.enregistrerAction(
                "RH",
                "Création employé",
                "Création de l'employé " + savedEmploye.getPrenom() + " " + savedEmploye.getNom()
                        + " au poste " + savedEmploye.getPoste().getLibelle()
        );

        return EmployeMapper.toDto(savedEmploye);
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

        String ancienNomComplet = employe.getPrenom() + " " + employe.getNom();
        String ancienPoste = employe.getPoste() != null ? employe.getPoste().getLibelle() : "-";
        String ancienDepartement = employe.getDepartement() != null ? employe.getDepartement().getNom() : "-";

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
        employe.setDateFinContrat(dto.getDateFinContrat());
        employe.setQuotaAnnuelConges(dto.getQuotaAnnuelConges());

        if (dto.getQuotaInitialConges() != null) {
            employe.setQuotaInitialConges(dto.getQuotaInitialConges());
        }

        employe.setStatut(dto.getStatut());
        employe.setTypeContrat(dto.getTypeContrat());
        employe.setDepartement(departement);
        employe.setPoste(poste);

        validateDateFinContrat(employe);

        Employe savedEmploye = employeRepository.save(employe);

        historiqueActionService.enregistrerAction(
                "RH",
                "Modification employé",
                "Modification de l'employé " + ancienNomComplet
                        + ". Nouveau nom : " + savedEmploye.getPrenom() + " " + savedEmploye.getNom()
                        + ". Département : " + ancienDepartement + " -> " + savedEmploye.getDepartement().getNom()
                        + ". Poste : " + ancienPoste + " -> " + savedEmploye.getPoste().getLibelle()
        );

        return EmployeMapper.toDto(savedEmploye);
    }

    public EmployeDto desactiverEmploye(Long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        employe.setStatut(StatutEmploye.INACTIF);

        Employe savedEmploye = employeRepository.save(employe);

        historiqueActionService.enregistrerAction(
                "RH",
                "Désactivation employé",
                "Désactivation de l'employé " + savedEmploye.getPrenom() + " " + savedEmploye.getNom()
        );

        return EmployeMapper.toDto(savedEmploye);
    }

    public void deleteEmploye(Long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        historiqueActionService.enregistrerAction(
                "RH",
                "Suppression employé",
                "Suppression de l'employé " + employe.getPrenom() + " " + employe.getNom()
        );

        employeRepository.delete(employe);
    }

    private void validateDateFinContrat(Employe employe) {
        if (employe.getTypeContrat() == TypeContrat.CDD) {
            if (employe.getDateFinContrat() == null) {
                throw new RuntimeException("La date de fin est obligatoire pour un contrat CDD.");
            }

            if (
                    employe.getDateEmbauche() != null
                            && employe.getDateFinContrat().isBefore(employe.getDateEmbauche())
            ) {
                throw new RuntimeException("La date de fin du contrat doit être après la date d'embauche.");
            }
        } else {
            employe.setDateFinContrat(null);
        }
    }
}