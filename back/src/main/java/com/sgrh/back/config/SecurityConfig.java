package com.sgrh.back.config;

import com.sgrh.back.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/create-admin"
                        ).permitAll()

                        .requestMatchers("/api/auth/register")
                        .hasAuthority("ROLE_ADMIN")

                        .requestMatchers("/api/employes/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_RH")

                        .requestMatchers("/api/departements/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_RH")

                        .requestMatchers("/api/postes/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_RH")

                        .requestMatchers("/api/conges/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_RH", "ROLE_EMPLOYE")

                        .requestMatchers("/api/fiches-paie/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_RH", "ROLE_EMPLOYE")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}