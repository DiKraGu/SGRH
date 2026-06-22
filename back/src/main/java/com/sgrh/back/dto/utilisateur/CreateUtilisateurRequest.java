package com.sgrh.back.dto.utilisateur;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUtilisateurRequest {

    private String email;
    private String motDePasse;
    private String role;
    private Long employeId;
}