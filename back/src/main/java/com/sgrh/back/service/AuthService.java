package com.sgrh.back.service;

import com.sgrh.back.dto.auth.LoginRequest;
import com.sgrh.back.dto.auth.LoginResponse;
import com.sgrh.back.entity.Utilisateur;
import com.sgrh.back.repository.UtilisateurRepository;
import com.sgrh.back.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        String token = jwtService.generateToken(utilisateur.getEmail());

        return LoginResponse.builder()
                .token(token)
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole())
                .build();
    }

    public Utilisateur createAdmin(
            String email,
            String motDePasse
    ) {

        Utilisateur utilisateur = Utilisateur.builder()
                .email(email)
                .motDePasse(passwordEncoder.encode(motDePasse))
                .role(com.sgrh.back.enums.Role.ADMIN)
                .statut(true)
                .build();

        return utilisateurRepository.save(utilisateur);
    }
}