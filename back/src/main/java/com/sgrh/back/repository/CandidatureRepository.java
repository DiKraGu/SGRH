package com.sgrh.back.repository;

import com.sgrh.back.entity.Candidature;
import com.sgrh.back.enums.StatutCandidature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidatureRepository extends JpaRepository<Candidature, Long> {

    List<Candidature> findByOffreId(Long offreId);
    List<Candidature> findByEmailOrderByDateSoumissionDesc(String email);

    boolean existsByEmailAndOffreId(String email, Long offreId);

    long countByStatut(StatutCandidature statut);
}