package com.sgrh.back.repository;

import com.sgrh.back.entity.HistoriqueAction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoriqueActionRepository extends JpaRepository<HistoriqueAction, Long> {

    List<HistoriqueAction> findAllByOrderByDateActionDesc();
}