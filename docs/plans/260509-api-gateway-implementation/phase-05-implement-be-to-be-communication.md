# Phase 05: Implement BE↔BE Direct Communication

## Overview

- **Priority:** P1
- **Status:** Pending
- **Effort:** 1.5h

Implement direct REST communication between user-service and wallet-service without going through gateway.

## Context Links

- [Research Report](../research/research-01-gateway-be-communication-analysis.md)
- [Phase 04](./phase-04-add-rate-limiting-circuit-breaker.md)

## Why Direct Invoke?

| Factor | Result |
|--------|--------|
| Latency | 1 hop (direct) vs 2 hops (via gateway) |
| Resilience | Gateway down ≠ internal calls fail |
| Load | Gateway handles external only |
| Complexity | Simple RestTemplate/WebClient |

## Use Cases for BE↔BE

| Flow | Calling Service | Called Service | Purpose |
|------|----------------|----------------|---------|
| P2P Transfer | wallet-service | user-service | Get recipient info |
| P2P Transfer | wallet-service | user-service | Verify sender balance |
| KYC Approval | user-service | wallet-service | Activate wallet |
| Bank Unlink | wallet-service | user-service | Verify zero balance |

## Implementation: RestTemplate Client

### 1. Add WebClient Dependency

In `wallet-service/pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

In `user-service/pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

### 2. Create Service Client

**In wallet-service:**
```java
@Service
public class UserServiceClient {
    private final WebClient webClient;

    public UserServiceClient(WebClient.Builder builder) {
        this.webClient = builder
            .baseUrl("http://user-service:8081")  // K8s DNS or localhost
            .build();
    }

    public Mono<UserResponse> getUserById(String userId) {
        return webClient.get()
            .uri("/api/users/{id}", userId)
            .retrieve()
            .bodyToMono(UserResponse.class);
    }

    public Mono<BalanceResponse> getBalance(String userId) {
        return webClient.get()
            .uri("/api/users/{id}/balance", userId)
            .retrieve()
            .bodyToMono(BalanceResponse.class);
    }
}
```

**In user-service:**
```java
@Service
public class WalletServiceClient {
    private final WebClient webClient;

    public WalletServiceClient(WebClient.Builder builder) {
        this.webClient = builder
            .baseUrl("http://wallet-service:8082")
            .build();
    }

    public Mono<WalletResponse> activateWallet(String userId, String kycId) {
        return webClient.post()
            .uri("/api/wallet/activate")
            .bodyValue(new ActivateWalletRequest(userId, kycId))
            .retrieve()
            .bodyToMono(WalletResponse.class);
    }
}
```

### 3. Use in Service

```java
@Service
public class P2PTransferService {
    private final UserServiceClient userServiceClient;

    public Mono<TransferResult> transfer(String fromUserId, String toUserId, BigDecimal amount) {
        // Check recipient exists (direct call, no gateway)
        return userServiceClient.getUserById(toUserId)
            .flatMap(recipient -> {
                // Check sender balance
                return userServiceClient.getBalance(fromUserId)
                    .flatMap(balance -> {
                        if (balance.getAvailable().compareTo(amount) < 0) {
                            return Mono.error(new InsufficientBalanceException());
                        }
                        // Process transfer
                        return processTransfer(fromUserId, toUserId, amount);
                    });
            });
    }
}
```

### 4. Kubernetes DNS (Production)

When deployed to Kubernetes, services are discoverable by name:
- `http://user-service:8081` resolves to user-service pod
- `http://wallet-service:8082` resolves to wallet-service pod

Spring Cloud LoadBalancer works automatically with K8s DNS.

### 5. Development (localhost)

For local dev without Kubernetes, update `/etc/hosts`:
```
127.0.0.1 user-service
127.0.0.1 wallet-service
```

Or use Docker Compose with network.

## Error Handling

```java
public Mono<UserResponse> getUserById(String userId) {
    return webClient.get()
        .uri("/api/users/{id}", userId)
        .retrieve()
        .onStatus(HttpStatus::isError, response ->
            Mono.error(new UserNotFoundException(userId))
        )
        .bodyToMono(UserResponse.class)
        .timeout(Duration.ofSeconds(3))
        .onErrorResume(TimeoutException.class,
            e -> Mono.error(new ServiceUnavailableException("user-service")));
}
```

## Todo List

- [ ] Add spring-boot-starter-webflux to wallet-service
- [ ] Add spring-boot-starter-webflux to user-service
- [ ] Create UserServiceClient in wallet-service
- [ ] Create WalletServiceClient in user-service
- [ ] Integrate into existing service methods (P2P, KYC approval)
- [ ] Add error handling and fallback
- [ ] Test direct calls work (no gateway involved)

## Success Criteria

- wallet-service can call user-service directly
- P2P transfer works without gateway
- Circuit breaker handles downstream failures gracefully

## Next Steps

Phase 06: Testing & Integration