package com.example.trains.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // 🔓 auth
                        .requestMatchers("/auth/**").permitAll()

                        // 👀 просмотр
                        .requestMatchers(HttpMethod.GET, "/**").permitAll()

                        // 🎫 покупка билета
                        .requestMatchers(HttpMethod.POST, "/tickets/**")
                        .hasAnyRole("USER", "WORKER", "ADMIN")

                        // 🛠 управление (WORKER + ADMIN)
                        .requestMatchers("/trains/**").hasAnyRole("WORKER", "ADMIN")
                        .requestMatchers("/stations/**").hasAnyRole("WORKER", "ADMIN")
                        .requestMatchers("/routes/**").hasAnyRole("WORKER", "ADMIN")
                        .requestMatchers("/seats/**").hasAnyRole("WORKER", "ADMIN")
                        .requestMatchers("/schedules/**").hasAnyRole("WORKER", "ADMIN")

                        // 👤 пользователи — только админ
                        .requestMatchers(HttpMethod.POST, "/users").hasRole("ADMIN")

                        // ❌ удаление — только админ
                        .requestMatchers(HttpMethod.DELETE, "/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/comments/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public org.springframework.security.authentication.AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}