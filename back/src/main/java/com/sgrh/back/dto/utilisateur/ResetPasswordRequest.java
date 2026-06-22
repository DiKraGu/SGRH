package com.sgrh.back.dto.utilisateur;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {

    private String nouveauMotDePasse;
}