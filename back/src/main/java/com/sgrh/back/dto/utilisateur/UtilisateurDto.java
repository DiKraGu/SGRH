package com.sgrh.back.dto.utilisateur;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilisateurDto {

    private Long id;
    private String email;
    private String role;
    private Boolean statut;

    private Long employeId;
    private String employeNomComplet;
}