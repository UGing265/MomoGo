package com.momogo.wallet.infrastructure.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class UserServiceClient {

    private final RestClient restClient;

    public UserServiceClient(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("http://user-service:8081")
                .build();
    }

    public Map<String, Object> getUserById(String userId) {
        return restClient.get()
                .uri("/api/users/{id}", userId)
                .retrieve()
                .body(Map.class);
    }

    public Map<String, Object> getBalance(String userId) {
        return restClient.get()
                .uri("/api/users/{id}/balance", userId)
                .retrieve()
                .body(Map.class);
    }

    public Map<String, Object> getUserByPhone(String phoneNumber) {
        return restClient.get()
                .uri("/api/users/phone/{phone}", phoneNumber)
                .retrieve()
                .body(Map.class);
    }

    public static class ServiceUnavailableException extends RuntimeException {
        public ServiceUnavailableException(String service) {
            super(service + " is unavailable");
        }
    }
}
