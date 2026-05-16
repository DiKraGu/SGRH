package com.sgrh.back.repository;

import com.sgrh.back.entity.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidatureRepository extends JpaRepository<Candidature, Long> {
    List<Candidature> findByOffreId(Long offreId);
    boolean existsByEmailAndOffreId(String email, Long offreId);
}