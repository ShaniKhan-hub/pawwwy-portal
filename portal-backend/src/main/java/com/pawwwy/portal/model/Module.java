package com.pawwwy.portal.model;

/**
 * Metadata for a single module displayed on the portal.
 *
 * <p>A module can be either:
 * <ul>
 *   <li><b>iframe-embedded</b> — {@link #iframeUrl} is set, frontend renders an iframe</li>
 *   <li><b>drop-in</b> — {@link #iframeUrl} is null, frontend renders the module as a React route</li>
 * </ul>
 */
public class Module {

    private final String slug;
    private final String name;
    private final String tagline;
    private final String description;
    private final String author;
    private final String role;
    private final String iframeUrl;
    private final boolean dropIn;
    private final String accentColor;
    private final String icon;

    public Module(String slug,
                  String name,
                  String tagline,
                  String description,
                  String author,
                  String role,
                  String iframeUrl,
                  boolean dropIn,
                  String accentColor,
                  String icon) {
        this.slug = slug;
        this.name = name;
        this.tagline = tagline;
        this.description = description;
        this.author = author;
        this.role = role;
        this.iframeUrl = iframeUrl;
        this.dropIn = dropIn;
        this.accentColor = accentColor;
        this.icon = icon;
    }

    public String getSlug() { return slug; }
    public String getName() { return name; }
    public String getTagline() { return tagline; }
    public String getDescription() { return description; }
    public String getAuthor() { return author; }
    public String getRole() { return role; }
    public String getIframeUrl() { return iframeUrl; }
    public boolean isDropIn() { return dropIn; }
    public String getAccentColor() { return accentColor; }
    public String getIcon() { return icon; }
}
