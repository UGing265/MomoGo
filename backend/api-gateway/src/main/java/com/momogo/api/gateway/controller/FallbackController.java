package com.momogo.api.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class FallbackController {

    @GetMapping("/fallback/{service}")
    public ResponseEntity<Map<String, Object>> fallback(
            @PathVariable String service,
            Exception e) {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "error", "Service temporarily unavailable",
                        "service", service,
                        "message", e != null ? e.getMessage() : "Unknown error",
                        "timestamp", Instant.now().toString()
                ));
    }

    @GetMapping("/fallback/rate-limited")
    public ResponseEntity<Map<String, Object>> rateLimited() {
        return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .body(Map.of(
                        "error", "Rate limit exceeded",
                        "retryAfter", 60,
                        "timestamp", Instant.now().toString()
                ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "api-gateway",
                "timestamp", Instant.now().toString()
        ));
    }
}