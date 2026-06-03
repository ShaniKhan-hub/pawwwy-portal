package com.pawwwy.hostelbills;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * HostelBillManager — web port.
 *
 * <p>Wraps Insharah Iqbal's original CLI design ({@code Expense}, {@code BillManager})
 * with a Spring Boot REST API + a minimal React frontend. Designed to be iframed
 * inside the Pawwwy portal.
 */
@SpringBootApplication
public class HostelBillsApplication {

    public static void main(String[] args) {
        SpringApplication.run(HostelBillsApplication.class, args);
    }
}
