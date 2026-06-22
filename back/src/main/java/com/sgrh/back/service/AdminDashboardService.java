package com.sgrh.back.service;

import com.sgrh.back.dto.dashboard.AdminDashboardStatsDto;
import com.sgrh.back.entity.Employe;
import com.sgrh.back.entity.Utilisateur;
import com.sgrh.back.enums.Role;
import com.sgrh.back.enums.StatutEmploye;
import com.sgrh.back.repository.EmployeRepository;
import com.sgrh.back.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UtilisateurRepository utilisateurRepository;
    private final EmployeRepository employeRepository;

    public AdminDashboardStatsDto getAdminStats() {
        List<Utilisateur> utilisateurs = utilisateurRepository.findAll();
        List<Employe> employes = employeRepository.findAll();

        long totalUtilisateurs = utilisateurs.size();
        long totalEmployes = employes.size();

        long totalRh = utilisateurs.stream()
                .filter(u -> u.getRole() == Role.RH)
                .count();

        long totalAdmins = utilisateurs.stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .count();

        long employesActifs = employes.stream()
                .filter(e -> e.getStatut() == StatutEmploye.ACTIF)
                .count();

        long employesInactifs = employes.stream()
                .filter(e -> e.getStatut() == StatutEmploye.INACTIF)
                .count();

        long employesAvecCompte = utilisateurs.stream()
                .filter(u -> u.getEmploye() != null)
                .count();

        long employesSansCompte = totalEmployes - employesAvecCompte;

        Map<String, Long> repartitionRoles = new LinkedHashMap<>();
        repartitionRoles.put("ADMIN", utilisateurs.stream().filter(u -> u.getRole() == Role.ADMIN).count());
        repartitionRoles.put("RH", utilisateurs.stream().filter(u -> u.getRole() == Role.RH).count());
        repartitionRoles.put("EMPLOYE", utilisateurs.stream().filter(u -> u.getRole() == Role.EMPLOYE).count());

        Map<String, Long> repartitionStatutEmployes = new LinkedHashMap<>();
        repartitionStatutEmployes.put("Actifs", employesActifs);
        repartitionStatutEmployes.put("Inactifs", employesInactifs);

        Map<String, Long> repartitionDepartements = new LinkedHashMap<>();

        for (Employe employe : employes) {
            String departementNom = employe.getDepartement() != null
                    ? employe.getDepartement().getNom()
                    : "Non affecté";

            repartitionDepartements.put(
                    departementNom,
                    repartitionDepartements.getOrDefault(departementNom, 0L) + 1
            );
        }

        return AdminDashboardStatsDto.builder()
                .totalUtilisateurs(totalUtilisateurs)
                .totalEmployes(totalEmployes)
                .totalRh(totalRh)
                .totalAdmins(totalAdmins)
                .employesActifs(employesActifs)
                .employesInactifs(employesInactifs)
                .employesSansCompte(employesSansCompte)
                .repartitionRoles(repartitionRoles)
                .repartitionStatutEmployes(repartitionStatutEmployes)
                .repartitionDepartements(repartitionDepartements)
                .build();
    }
}