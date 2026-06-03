package com.pawwwy.portal.controller;

import com.pawwwy.portal.model.GroupInfo;
import com.pawwwy.portal.model.Module;
import com.pawwwy.portal.service.ModuleRegistry;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Read-only API consumed by the React frontend.
 *
 * <ul>
 *   <li>{@code GET /api/modules} — four-module catalogue for the landing page</li>
 *   <li>{@code GET /api/group}   — group, course and member metadata for the Team page</li>
 * </ul>
 */
@RestController
@RequestMapping("/api")
public class PortalController {

    private final ModuleRegistry registry;

    public PortalController(ModuleRegistry registry) {
        this.registry = registry;
    }

    @GetMapping("/modules")
    public List<Module> modules() {
        return registry.getModules();
    }

    @GetMapping("/group")
    public GroupInfo group() {
        return registry.getGroupInfo();
    }

    @GetMapping("/health")
    public Health health() {
        return new Health("ok", "pawwwy-portal");
    }

    public record Health(String status, String service) {}
}
