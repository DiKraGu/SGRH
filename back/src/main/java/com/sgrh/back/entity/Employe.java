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

    private String nom;

    private String prenom;

    private String email;

    private String telephone;

    @Column(name = "date_embauche")
    private LocalDate dateEmbauche;

    @Column(name = "date_fin_contrat")
    private LocalDate dateFinContrat;

    @Column(name = "salaire_base")
    private BigDecimal salaireBase;

    @Column(name = "quota_annuel_conges")
    private Integer quotaAnnuelConges;

    @Column(name = "quota_initial_conges")
    private Integer quotaInitialConges;

    @Enumerated(EnumType.STRING)
    private StatutEmploye statut;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_contrat")
    private TypeContrat typeContrat;

    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;

    @ManyToOne
    @JoinColumn(name = "poste_id")
    private Poste poste;
}