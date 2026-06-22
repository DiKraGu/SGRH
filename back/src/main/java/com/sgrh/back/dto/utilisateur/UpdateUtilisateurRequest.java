package com.sgrh.back.dto.utilisateur;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUtilisateurRequest {

    private String email;
    private String nouveauMotDePasse;
    private String role;
    private Boolean statut;
}