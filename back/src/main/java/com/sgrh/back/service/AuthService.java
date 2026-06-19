package com.sgrh.back.service;

import com.sgrh.back.dto.auth.LoginRequest;
import com.sgrh.back.dto.auth.LoginResponse;
import com.sgrh.back.dto.auth.RegisterRequest;
import com.sgrh.back.entity.Utilisateur;
import com.sgrh.back.enums.Role;
import com.sgrh.back.enums.StatutEmploye;
import com.sgrh.back.repository.UtilisateurRepository;
import com.sgrh.back.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect."));

//        if (!passwordEncoder.matches(request.getMotDePasse(), utilisateur.getMotDePasse())) {
//            throw new RuntimeException("Email ou mot de passe incorrect.");
//        }

        System.out.println("EMAIL SAISI = " + request.getEmail());
        System.out.println("MDP SAISI = " + request.getMotDePasse());
        System.out.println("HASH BDD = " + utilisateur.getMotDePasse());

        boolean match = passwordEncoder.matches(
                request.getMotDePasse(),
                utilisateur.getMotDePasse()
        );

        System.out.println("MATCH = " + match);

        if (!match) {
            throw new RuntimeException("Email ou mot de passe incorrect.");
        }

        if (Boolean.FALSE.equals(utilisateur.getStatut())) {
            throw new RuntimeException("Votre compte utilisateur est désactivé.");
        }

        if (
                utilisateur.getRole() == Role.EMPLOYE
                        && utilisateur.getEmploye() != null
                        && utilisateur.getEmploye().getStatut() == StatutEmploye.INACTIF
        ) {
            throw new RuntimeException("Votre compte employé a été désactivé par le service RH.");
        }

        String token = jwtService.generateToken(utilisateur.getEmail());

        return LoginResponse.builder()
                .token(token)
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().name())
                .build();
    }

    public Utilisateur createAdmin(String email, String password) {
        utilisateurRepository.findByEmail(email).ifPresent(existingUser -> {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà.");
        });

        Utilisateur admin = Utilisateur.builder()
                .email(email)
                .motDePasse(passwordEncoder.encode(password))
                .role(Role.ADMIN)
                .statut(true)
                .build();

        return utilisateurRepository.save(admin);
    }

    public Utilisateur register(RegisterRequest request) {
        utilisateurRepository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà.");
        });

        Utilisateur utilisateur = Utilisateur.builder()
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(request.getRole())
                .statut(true)
                .build();

        return utilisateurRepository.save(utilisateur);
    }
}