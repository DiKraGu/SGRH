package com.sgrh.back.repository;

import com.sgrh.back.entity.Conge;
import com.sgrh.back.enums.StatutConge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CongeRepository extends JpaRepository<Conge, Long> {

    List<Conge> findByStatut(StatutConge statut);

    List<Conge> findByEmployeId(Long employeId);

    long countByStatut(StatutConge statut);
}