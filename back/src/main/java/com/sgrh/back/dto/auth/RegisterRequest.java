package com.sgrh.back.dto.auth;

import com.sgrh.back.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    private String email;

    private String motDePasse;

    private Role role;

    private Long employeId;
}