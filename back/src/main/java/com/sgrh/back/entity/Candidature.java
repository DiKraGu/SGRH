package com.sgrh.back.entity;

import com.sgrh.back.enums.StatutCandidature;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "candidatures",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"email", "offre_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String email;

    private String telephone;

    @Column(columnDefinition = "TEXT")
    private String lettreMotivation;

    private String cheminCV;

    @Column(nullable = false)
    private LocalDate dateSoumission;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCandidature statut;

    @ManyToOne
    @JoinColumn(name = "offre_id", nullable = false)
    private OffreEmploi offre;
}