package com.pawwwy.portal.model;

/**
 * A single group member.
 */
public class Member {

    private final String name;
    private final String moduleSlug;
    private final String role;

    public Member(String name, String moduleSlug, String role) {
        this.name = name;
        this.moduleSlug = moduleSlug;
        this.role = role;
    }

    public String getName() { return name; }
    public String getModuleSlug() { return moduleSlug; }
    public String getRole() { return role; }
}
