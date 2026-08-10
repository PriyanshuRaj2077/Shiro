package com.shiro.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${frontend.url:http://127.0.0.1:5500}")
    private String frontendUrl;

    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                List<String> origins = new ArrayList<>(List.of(
                        "http://127.0.0.1:5500",
                        "http://localhost:5500",
                        "http://localhost:8080"
                ));

                if (frontendUrl != null && !frontendUrl.isBlank()) {
                    String[] configuredOrigins = frontendUrl.split(",");
                    for (String origin : configuredOrigins) {
                        String trimmed = origin.trim();
                        if (!trimmed.isEmpty() && !origins.contains(trimmed)) {
                            origins.add(trimmed);
                        }
                    }
                }

                registry.addMapping("/**")
                        .allowedOrigins(origins.toArray(new String[0]))
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}