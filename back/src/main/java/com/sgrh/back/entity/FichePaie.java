package com.sgrh.back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "fiches_paie",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"mois", "annee", "employe_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FichePaie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer mois;

    @Column(nullable = false)
    private Integer annee;

    @Column(nullable = false)
    private Double salaireBrut;

    private Double primes;

    private Double deductions;

    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = false)
    private Employe employe;

    public Double getSalaireNet() {
        double p = primes != null ? primes : 0.0;
        double d = deductions != null ? deductions : 0.0;
        return salaireBrut + p - d;
    }
}