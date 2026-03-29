package com.example.demo.config;

import com.example.demo.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()

                        // ---------- PUBLIC ----------
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Payment + Invoice (Cashfree needs this)
                        .requestMatchers("/api/payment/**").permitAll()
                        .requestMatchers("/api/orders/invoice/**").permitAll()

                        .requestMatchers("/api/users/me").authenticated()
                        .requestMatchers("/api/users/update").authenticated()
                        .requestMatchers("/api/auth/me").authenticated()
                        // ---------- ADMIN ----------
                        .requestMatchers("/api/admin/**").authenticated()


                        .requestMatchers("/farmer/**").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/api/products/add").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/api/products/my-products").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/api/bid/accept/**").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/api/bid/product/**").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/api/orders/farmer/**").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/api/bid/farmer/notifications").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/orders/update-delivery/**").hasAuthority("ROLE_FARMER")
                        .requestMatchers("/api/feedback/submit/**").hasAuthority("ROLE_RETAILER")
                        .requestMatchers("/api/feedback/farmer").hasAuthority("ROLE_FARMER")
                        /* ================= FEEDBACK ================= */
                        // Retailer submits feedback
                        .requestMatchers(HttpMethod.POST, "/api/feedback/submit/**")
                        .hasAuthority("ROLE_RETAILER")
                        // ---------- RETAILER ----------
                        .requestMatchers("/api/bid/place/**").hasAuthority("ROLE_RETAILER")
                        .requestMatchers("/api/bid/notifications/**").hasAuthority("ROLE_RETAILER")
                        .requestMatchers("/api/bid/accepted").hasAuthority("ROLE_RETAILER")
                        .requestMatchers(HttpMethod.GET, "/api/orders/retailer/**").authenticated()
                        .requestMatchers("/api/orders/retailer/**").hasAuthority("ROLE_RETAILER")
                        .requestMatchers("/retailer/stats").hasAuthority("ROLE_RETAILER")
                        .requestMatchers("/api/orders/buy/**").hasAuthority("ROLE_RETAILER")



                        // ---------- FALLBACK ----------
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
