package com.pawwwy.hostelbills.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security config — DISABLES X-Frame-Options so the Pawwwy portal can iframe this module.
 *
 * <p>See {@code pawwwy-portal/X_FRAME_FIX.md} for the full explanation of why this is
 * needed and what {@code frame-ancestors} should contain.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .headers(headers -> headers
                        .frameOptions(frame -> frame.disable())
                        .contentSecurityPolicy(csp -> csp.policyDirectives(
                                "frame-ancestors 'self' " +
                                        // Portal dev (Vite)
                                        "http://localhost:5173 " +
                                        // Portal local prod (Spring Boot serving built React)
                                        "http://localhost:8090 " +
                                        // Portal deployed on Render
                                        "https://pawwwy.onrender.com"
                        ))
                );
        return http.build();
    }
}
