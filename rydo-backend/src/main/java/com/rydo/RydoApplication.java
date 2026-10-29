package com.rydo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class RydoApplication {

    public static void main(String[] args) {
        SpringApplication.run(RydoApplication.class, args);
        System.out.println("\n" +
                "╔══════════════════════════════════════════════════════════╗\n" +
                "║                                                          ║\n" +
                "║   🚲 Rydo Backend Started Successfully! 🚲              ║\n" +
                "║                                                          ║\n" +
                "║   Server: http://localhost:8080                         ║\n" +
                "║   H2 Console: http://localhost:8080/h2-console          ║\n" +
                "║   API Prefix: /api                                      ║\n" +
                "║                                                          ║\n" +
                "║   India's First Hourly Bike Sharing Platform            ║\n" +
                "║                                                          ║\n" +
                "╚══════════════════════════════════════════════════════════╝\n");
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
