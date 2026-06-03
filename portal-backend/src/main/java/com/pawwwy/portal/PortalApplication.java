package com.pawwwy.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Pawwwy Portal — entry point.
 *
 * Group project for Object-Oriented Programming, BESE-31 C, MCS NUST.
 * Hosts four group modules: Catsweeper, PawPlan, Pawwwy Games, HostelBillManager.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class PortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortalApplication.class, args);
    }
}
