package com.sgrh.back.dto.poste;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PosteDto {

    private Long id;

    private String libelle;

    private String description;

    private Long departementId;

    private String departementNom;
}