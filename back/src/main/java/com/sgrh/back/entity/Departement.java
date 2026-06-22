package com.sgrh.back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "departements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Departement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String description;

    @Column(name = "id_responsable")
    private Long idResponsable;
}