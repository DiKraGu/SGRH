package com.sgrh.back.repository;

import com.sgrh.back.entity.Departement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartementRepository extends JpaRepository<Departement, Long> {
}