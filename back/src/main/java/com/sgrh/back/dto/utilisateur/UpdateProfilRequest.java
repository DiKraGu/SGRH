package com.sgrh.back.dto.utilisateur;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfilRequest {

    private String email;
    private String nouveauMotDePasse;
}