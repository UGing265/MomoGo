package com.momogo.user.infrastructure.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Map;

@Component
public class WalletServiceClient {

    private final RestClient restClient;

    public WalletServiceClient(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("http://wallet-service:8082")
                .build();
    }

    public Map<String, Object> activateWallet(String userId, String kycId) {
        return restClient.post()
                .uri("/api/wallet/activate")
                .body(Map.of("userId", userId, "kycId", kycId))
                .retrieve()
                .body(Map.class);
    }

    public Map<String, Object> checkBalance(String userId) {
        return restClient.get()
                .uri("/api/wallet/user/{userId}/balance", userId)
                .retrieve()
                .body(Map.class);
    }

    public static class ServiceUnavailableException extends RuntimeException {
        public ServiceUnavailableException(String service) {
            super(service + " is unavailable");
        }
    }
}
