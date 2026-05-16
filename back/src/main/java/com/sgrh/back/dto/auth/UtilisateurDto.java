package com.sgrh.back.dto.auth;

import com.sgrh.back.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilisateurDto {

    private Long id;

    private String email;

    private Role role;

    private Boolean statut;

    private Long employeId;
}