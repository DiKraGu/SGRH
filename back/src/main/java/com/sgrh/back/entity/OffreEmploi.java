package com.sgrh.back.entity;

import com.sgrh.back.enums.StatutOffre;
import com.sgrh.back.enums.TypeContrat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "offres_emploi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OffreEmploi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    private Double salairePropose;

    private LocalDate dateLimite;

    @Column(nullable = false)
    private LocalDate datePublication;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutOffre statut;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeContrat typeContrat;

    @ManyToOne
    @JoinColumn(name = "departement_id", nullable = false)
    private Departement departement;

    @ManyToOne
    @JoinColumn(name = "poste_id", nullable = false)
    private Poste poste;
}