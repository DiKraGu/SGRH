package com.sgrh.back.controller;

import com.sgrh.back.dto.auth.LoginRequest;
import com.sgrh.back.dto.auth.LoginResponse;
import com.sgrh.back.entity.Utilisateur;
import com.sgrh.back.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request
    ) {

        return authService.login(request);
    }

    @PostMapping("/create-admin")
    public Utilisateur createAdmin(
            @RequestParam String email,
            @RequestParam String password
    ) {

        return authService.createAdmin(email, password);
    }
}