package com.pawwwy.portal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Single-page-app fallback.
 *
 * <p>The portal frontend is a React SPA with client-side routes like
 * {@code /play/catsweeper} and {@code /team}. When the user hits one of these
 * URLs directly (refresh, deep link), Spring Boot must serve {@code index.html}
 * so React Router can take over.
 *
 * <p>This is in addition to Spring Boot's default static-resource handler,
 * which serves {@code /index.html}, {@code /assets/**} etc. from the classpath
 * {@code static/} directory automatically.
 */
@Configuration
public class SpaFallbackConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(@NonNull ViewControllerRegistry registry) {
        // Forward client-side routes to the React entry point.
        registry.addViewController("/play/{slug}").setViewName("forward:/index.html");
        registry.addViewController("/team").setViewName("forward:/index.html");
    }
}
