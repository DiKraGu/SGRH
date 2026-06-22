package com.sgrh.back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "postes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Poste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String libelle;

    private String description;

    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;
}