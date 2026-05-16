package com.sgrh.back.repository;

import com.sgrh.back.entity.OffreEmploi;
import com.sgrh.back.enums.StatutOffre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OffreEmploiRepository extends JpaRepository<OffreEmploi, Long> {

    List<OffreEmploi> findByStatut(StatutOffre statut);

    long countByStatut(StatutOffre statut);
}