package com.sgrh.back.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fiches_paie")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FichePaie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_fiche")
    private String numeroFiche;

    @Column(nullable = false)
    private Integer mois;

    @Column(nullable = false)
    private Integer annee;

    @Column(name = "salaire_brut", nullable = false)
    private BigDecimal salaireBrut;

    @Column(nullable = false)
    private BigDecimal primes;

    @Column(nullable = false)
    private BigDecimal deductions;

    @Column(name = "salaire_net")
    private BigDecimal salaireNet;

    @Column(name = "date_generation")
    private LocalDate dateGeneration;

    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = false)
    private Employe employe;
}