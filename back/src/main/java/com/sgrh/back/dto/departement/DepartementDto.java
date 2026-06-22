package com.sgrh.back.dto.departement;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartementDto {

    private Long id;

    private String nom;

    private String description;
}