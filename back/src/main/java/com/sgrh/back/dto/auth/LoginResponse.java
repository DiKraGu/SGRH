package com.sgrh.back.dto.auth;

import com.sgrh.back.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;

    private String email;

    private Role role;
}
