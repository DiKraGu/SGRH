package com.sgrh.back.entity;

import com.sgrh.back.enums.StatutEmploye;
import com.sgrh.back.enums.TypeContrat;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private String telephone;

    @Column(nullable = false)
    private BigDecimal salaireBase;

    @Column(nullable = false)
    private LocalDate dateEmbauche;

    @Builder.Default
    private Integer quotaAnnuelConges = 22;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutEmploye statut;

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