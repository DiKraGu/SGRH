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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
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

                        .requestMatchers("/cv/**")
                        .permitAll()

                        .requestMatchers("/api/auth/register")
                        .hasAuthority("ROLE_ADMIN")

                        .requestMatchers("/api/employes/me")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_RH", "ROLE_EMPLOYE")

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

                        .requestMatchers("/api/offres/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_RH")

                        .requestMatchers("/api/candidatures/**")
                        .permitAll()

                        .requestMatchers("/api/dashboard/rh/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_RH")

                        .requestMatchers("/api/admin/dashboard/**")
                        .hasAuthority("ROLE_ADMIN")

                        .requestMatchers("/api/admin/utilisateurs/**")
                        .hasAuthority("ROLE_ADMIN")

                        .requestMatchers("/api/profil/**")
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