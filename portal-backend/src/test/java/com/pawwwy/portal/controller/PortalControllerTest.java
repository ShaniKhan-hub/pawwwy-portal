package com.pawwwy.portal.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PortalControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    void modulesEndpointReturnsFourModules() throws Exception {
        mvc.perform(get("/api/modules"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[?(@.slug=='catsweeper')].name").value("Catsweeper"))
                .andExpect(jsonPath("$[?(@.slug=='pawplan')].dropIn").value(true))
                .andExpect(jsonPath("$[?(@.slug=='pawwwy-games')].author").value("Memuna Javed"))
                .andExpect(jsonPath("$[?(@.slug=='hostelbills')].author").value("Insharah Iqbal"));
    }

    @Test
    void groupEndpointReturnsExpectedShape() throws Exception {
        mvc.perform(get("/api/group"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectName").value("Pawwwy"))
                .andExpect(jsonPath("$.batch").value("BESE-31 C"))
                .andExpect(jsonPath("$.university").value("Military College of Signals, NUST"))
                .andExpect(jsonPath("$.members.length()").value(4));
    }

    @Test
    void healthEndpointReturnsOk() throws Exception {
        mvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(jsonPath("$.service").value("pawwwy-portal"));
    }
}
