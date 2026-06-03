package com.pawwwy.hostelbills.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * The frontend is a small SPA. Deep-link refreshes (or the embedded iframe pointing
 * at a sub-path) must serve {@code index.html} so React Router takes over.
 *
 * <p>This module's frontend is a single page so we only need the root, but the
 * pattern is here for consistency.
 */
@Configuration
public class SpaFallbackConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(@NonNull ViewControllerRegistry registry) {
        // No client-side routes besides "/" in this module right now.
        // Add forwards here if the frontend grows multi-route in the future.
    }
}
