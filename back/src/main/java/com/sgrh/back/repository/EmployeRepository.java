package com.sgrh.back.repository;

import com.sgrh.back.entity.Employe;
import com.sgrh.back.enums.StatutEmploye;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeRepository extends JpaRepository<Employe, Long> {
    List<Employe> findByStatut(StatutEmploye statut);
    List<Employe> findByNomContainingIgnoreCase(String nom);
}