package com.sgrh.back.repository;

import com.sgrh.back.entity.Poste;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PosteRepository extends JpaRepository<Poste, Long> {
}