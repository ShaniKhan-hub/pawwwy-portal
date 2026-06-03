package com.pawwwy.portal.service;

import com.pawwwy.portal.config.ModuleUrlProperties;
import com.pawwwy.portal.model.GroupInfo;
import com.pawwwy.portal.model.Member;
import com.pawwwy.portal.model.Module;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Single source of truth for the portal's module list and group metadata.
 *
 * <p>Modules are defined in code (not a database) because the set is fixed for the
 * coursework deliverable: four modules, one per group member. Iframe URLs are
 * config-driven via {@link ModuleUrlProperties} so deployment URLs can be swapped
 * without code changes.
 */
@Service
public class ModuleRegistry {

    private final ModuleUrlProperties urls;

    public ModuleRegistry(ModuleUrlProperties urls) {
        this.urls = urls;
    }

    public List<Module> getModules() {
        return List.of(
                new Module(
                        "catsweeper",
                        "Catsweeper",
                        "Minesweeper, with cats.",
                        "A cat-themed Minesweeper built on a full OOP class hierarchy — tiles, mines, " +
                                "achievements and a paw-driven HUD. Backend in Spring Boot, frontend in React.",
                        "Shahram Ahmed",
                        "Minesweeper",
                        urls.getCatsweeperUrl(),
                        false,
                        "#C97B5C",
                        "bomb"
                ),
                new Module(
                        "pawplan",
                        "PawPlan",
                        "Track assignments. Before they track you.",
                        "An assignment and task tracker with categories, priorities, statuses and deadlines. " +
                                "OOP design in Java, presented as a self-contained React component embedded directly into the portal.",
                        "Muhammad Faran Shehryar",
                        "Task Tracker",
                        null,
                        true,
                        "#5C8A6E",
                        "list-checks"
                ),
                new Module(
                        "pawwwy-games",
                        "Pawwwy Games",
                        "Two tiny games. One sleepy cat.",
                        "Two cat-themed mini-games in one app: Tic-Tac-Toe with a feline twist, and CatRunner, " +
                                "a one-button endless runner. Built in React + TypeScript.",
                        "Memuna Javed",
                        "Mini-games",
                        urls.getPawwwyGamesUrl(),
                        false,
                        "#B07A36",
                        "gamepad-2"
                ),
                new Module(
                        "hostelbills",
                        "HostelBillManager",
                        "Hostel bills, finally readable.",
                        "A hostel student expense tracker — add bills, group them by month, filter by category, " +
                                "and see totals at a glance. Designed in Java as a CLI, ported to the web while preserving the original class design.",
                        "Insharah Iqbal",
                        "Expense Tracker",
                        urls.getHostelbillsUrl(),
                        false,
                        "#6A7FBF",
                        "wallet"
                )
        );
    }

    public GroupInfo getGroupInfo() {
        List<Member> members = List.of(
                new Member("Shahram Ahmed", "catsweeper", "Minesweeper"),
                new Member("Muhammad Faran Shehryar", "pawplan", "Task Tracker"),
                new Member("Memuna Javed", "pawwwy-games", "Mini-games"),
                new Member("Insharah Iqbal", "hostelbills", "Expense Tracker")
        );

        return new GroupInfo(
                "Pawwwy",
                "Four projects. One portal. By BESE-31 C.",
                "BESE-31 C",
                "Object-Oriented Programming — Integration Project",
                "Military College of Signals, NUST",
                members
        );
    }
}
