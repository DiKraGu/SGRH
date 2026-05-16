package com.sgrh.back.repository;

import com.sgrh.back.entity.FichePaie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FichePaieRepository extends JpaRepository<FichePaie, Long> {
    List<FichePaie> findByEmployeId(Long employeId);
    Optional<FichePaie> findByEmployeIdAndMoisAndAnnee(Long employeId, Integer mois, Integer annee);
}