package com.sgrh.back.entity;

import com.sgrh.back.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "utilisateurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    @Column(nullable = false)
    private Boolean statut = true;

    @OneToOne
    @JoinColumn(name = "employe_id", unique = true)
    private Employe employe;
}