package com.pawwwy.portal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Config-driven module URLs.
 *
 * <p>Set these in {@code application.properties} (or via environment variables in production)
 * to point at the live deployments. Defaults are sensible placeholders for local dev.
 */
@ConfigurationProperties(prefix = "pawwwy.modules")
public class ModuleUrlProperties {

    private String catsweeperUrl = "https://catsweeper.onrender.com";
    private String pawwwyGamesUrl = "https://pawwwy-games.onrender.com";
    private String hostelbillsUrl = "https://hostelbills.onrender.com";

    public String getCatsweeperUrl() { return catsweeperUrl; }
    public void setCatsweeperUrl(String catsweeperUrl) { this.catsweeperUrl = catsweeperUrl; }

    public String getPawwwyGamesUrl() { return pawwwyGamesUrl; }
    public void setPawwwyGamesUrl(String pawwwyGamesUrl) { this.pawwwyGamesUrl = pawwwyGamesUrl; }

    public String getHostelbillsUrl() { return hostelbillsUrl; }
    public void setHostelbillsUrl(String hostelbillsUrl) { this.hostelbillsUrl = hostelbillsUrl; }
}
