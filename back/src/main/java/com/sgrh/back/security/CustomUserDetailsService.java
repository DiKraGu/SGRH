package com.sgrh.back.security;

import com.sgrh.back.entity.Utilisateur;
import com.sgrh.back.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Utilisateur introuvable")
                );

        return new User(
                utilisateur.getEmail(),
                utilisateur.getMotDePasse(),
                List.of(
                        new SimpleGrantedAuthority(
                                "ROLE_" + utilisateur.getRole().name()
                        )
                )
        );
    }
}