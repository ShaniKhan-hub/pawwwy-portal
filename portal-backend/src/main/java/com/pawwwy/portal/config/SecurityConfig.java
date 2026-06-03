package com.pawwwy.portal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for the portal backend.
 *
 * <p>The portal serves a public read-only API and a static React bundle; no auth,
 * no sessions, no CSRF (the API is GET-only).
 *
 * <p>The portal itself must <b>not</b> be embeddable in any other site, so
 * {@code X-Frame-Options: DENY} is left enabled and a strict
 * {@code Content-Security-Policy: frame-ancestors 'none'} is added on top.
 * Iframing of the four <em>child</em> modules happens entirely on the frontend
 * (HTML iframe pointing at deployed URLs) and is not affected by this header.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public API
                        .requestMatchers("/api/**").permitAll()
                        // Static assets (the React bundle, once built into src/main/resources/static)
                        .requestMatchers("/", "/index.html", "/assets/**", "/favicon.ico",
                                "/static/**", "/play/**", "/team").permitAll()
                        .anyRequest().permitAll()
                )
                .headers(headers -> headers
                        // Lock the portal against being framed anywhere.
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
                        .contentSecurityPolicy(csp -> csp.policyDirectives(
                                "default-src 'self'; " +
                                        "script-src 'self' 'unsafe-inline'; " +
                                        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                                        "font-src 'self' https://fonts.gstatic.com; " +
                                        "img-src 'self' data: https:; " +
                                        "connect-src 'self'; " +
                                        // The portal HOSTS iframes but is not itself iframable
                                        "frame-src https:; " +
                                        "frame-ancestors 'none'"
                        ))
                );
        return http.build();
    }
}
