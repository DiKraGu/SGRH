package com.sgrh.back.repository;

import com.sgrh.back.entity.Departement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartementRepository extends JpaRepository<Departement, Long> {
    Optional<Departement> findByNom(String nom);
    boolean existsByNom(String nom);
}