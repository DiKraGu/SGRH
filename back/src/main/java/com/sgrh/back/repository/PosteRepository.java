package com.sgrh.back.repository;

import com.sgrh.back.entity.Poste;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PosteRepository extends JpaRepository<Poste, Long> {

    List<Poste> findByDepartementId(Long departementId);
}