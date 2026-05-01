# Phase 04: Integration

## Context Links

- SRS: `D:\AShiroru\ProgramCode\Project\Team\MomoGo\docs\srs.md`
- Phase 02: `phase-02-user-service-core.md`
- Phase 03: `phase-03-wallet-service-core.md`

## Overview

- **Priority:** P1 (Critical)
- **Status:** pending
- **Description:** Implement inter-service communication, bank gateway integration with circuit breaker, event publishing, JWT validation at gateway, and shared security patterns.

## Key Insights from Research

1. **Inter-service Communication:** REST for external, gRPC optional for internal (start with REST)
2. **Circuit Breaker:** Resilience4j per-bank (failure rate 50%, sliding window 10, wait 30s in open)
3. **Event Publishing:** Outbox pattern ensures at-least-once delivery
4. **Bank Tokenization:** PCI DSS compliance - tokenize card numbers, never store raw
5. **JWT Validation:** API Gateway validates all requests before routing

## Requirements

### Functional

1. **Inter-Service Communication**
   - user-service -> wallet-service: KYC approval triggers wallet activation
   - wallet-service -> user-service: Balance check for bank unlink (BR-ACC-03)
   - gRPC or REST communication

2. **Bank Gateway Integration**
   - Vietcombank and Techcombank APIs
   - Circuit breaker per bank adapter
   - Tokenization of account numbers
   - Balance verification before deposit

3. **Event System**
   - Deposit/withdraw events via outbox
   - P2P transfer events (debit sender, credit recipient)
   - KYC approval event (user-service -> wallet-service)
   - Kafka or in-memory pub/sub for MVP

4. **API Gateway Security**
   - JWT validation on all routes
   - Rate limiting per user (Bucket4j)
   - Request logging and tracing

### Non-Functional

- Circuit breaker prevents cascade failures
- 99.9% uptime for core transaction path
- < 500ms latency for bank API calls (with circuit breaker)
- Event delivery: at-least-once

## Architecture

```
                                    +------------------+
                                    |   API Gateway    |
                                    |  (JWT Validate) |
                                    +--------+--------+
                                             |
                         +-------------------+-------------------+
                         |                   |                   |
                 +-------v-------+   +-------v-------+   +-------v-------+
                 | user-service  |   |wallet-service |   | future-service|
                 |    (8081)     |   |    (8082)      |   |     (8083)    |
                 +-------+-------+   +-------+-------+   +---------------+
                         |                   |
                         |   +----+  +------+------+
                         |   |Bank|  | Bank Adapter  |
                         |   |API |  |(VCB / TCB)    |
                         |   +----+  +---------------+
                         |
                         v
               +-----------------+
               |  Kafka/RabbitMQ |
               | (Event Bus)     |
               +--------+--------+
                        |
         +-------------+-------------+
         |             |             |
+--------v---+  +-------v----+  +-----v------+
| user-service |  |wallet-svc  |  |notify-svc |
| (subscribe)  |  |(subscribe) |  |(subscribe)|
+-------------+  +------------+  +-----------+
```

## Bank Adapter with Circuit Breaker

```java
@Component
public class BankAdapterFactory {
    private final VietcombankAdapter vietcombankAdapter;
    private final TechcombankAdapter techcombankAdapter;

    public BankAdapter getAdapter(String bankCode) {
        return switch (bankCode) {
            case "VCB" -> vietcombankAdapter;
            case "TCB" -> techcombankAdapter;
            default -> throw new UnsupportedBankException(bankCode);
        };
    }
}

@CircuitBreaker(name = "vcb", fallbackMethod = "vcbFallback")
public class VietcombankAdapter implements BankAdapter {
    @Retry(name = "vcb-retry")
    public BankLinkResponse linkAccount(BankLinkRequest request) {
        // Call VCB Open Banking API
    }
}
```

## Resilience4j Configuration

```yaml
resilience4j:
  circuitbreaker:
    instances:
      vcb:
        failureRateThreshold: 50
        slidingWindowSize: 10
        waitDurationInOpenState: 30s
        permittedNumberOfCallsInHalfOpenState: 3
      tcb:
        failureRateThreshold: 50
        slidingWindowSize: 10
        waitDurationInOpenState: 30s
  retry:
    instances:
      vcb-retry:
        maxAttempts: 3
        waitDuration: 500ms
        exponentialBackoffMultiplier: 2
```

## Event Schemas

```json
// KycApprovedEvent
{
  "eventType": "KYC_APPROVED",
  "userId": "uuid",
  "timestamp": "2026-05-01T10:00:00Z",
  "kycId": "uuid"
}

// P2PTransferEvent
{
  "eventType": "P2P_TRANSFER",
  "transactionId": "uuid",
  "senderId": "uuid",
  "recipientId": "uuid",
  "amount": 5000000,
  "timestamp": "2026-05-01T10:00:00Z"
}

// DepositEvent
{
  "eventType": "DEPOSIT",
  "transactionId": "uuid",
  "walletId": "uuid",
  "amount": 10000000,
  "bankAccountId": "uuid",
  "timestamp": "2026-05-01T10:00:00Z"
}
```

## Security: Tokenization

```java
// PCI DSS Compliance
public interface TokenizationService {
    String tokenize(String cardNumber);  // Store token, not raw
    String detokenize(String token);     // Retrieve for bank API call
    boolean validateToken(String token);
}

// Bank adapter uses token
public class VietcombankAdapter {
    private final TokenizationService tokenizationService;

    public BankLinkResponse linkAccount(BankLinkRequest request) {
        String tokenizedAccount = tokenizationService.tokenize(request.getAccountNumber());
        // Store token, call bank API with token
    }
}
```

## Implementation Steps

1. **Setup Kafka/RabbitMQ**
   - Docker compose for local development
   - Topic/queue definitions: kyc-events, payment-events, notification-events
   - Consumer groups per service

2. **Implement Outbox Publisher**
   - Polling scheduler (every 1 second)
   - Batch publish pending events
   - Mark as published after acknowledgment
   - Dead letter queue for failed events

3. **Implement Event Consumers**
   - user-service: Listen for wallet events (balance changes)
   - wallet-service: Listen for KYC events (activate wallet)
   - notification-service stub (future)

4. **Implement Bank Adapter Factory**
   - Dynamic adapter resolution by bank code
   - Per-bank circuit breaker instances
   - Retry configuration per bank

5. **Implement Tokenization Service**
   - Secure token storage (AES-256)
   - Token->card mapping (encrypted)
   - No raw card data in database

6. **Update API Gateway**
   - JWT validation filter (verify signature, check expiration)
   - Extract user ID from JWT claims
   - Add X-User-Id header for downstream services
   - Rate limiting per user (Bucket4j + Redis)

7. **Implement Inter-Service Calls**
   - user-service calls wallet-service for wallet activation
   - wallet-service calls user-service for KYC status check
   - Use RestTemplate or WebClient with circuit breaker

8. **Add Request Tracing**
   - Correlation ID header propagation
   - Structured logging (MDC)
   - Trace ID in logs

## Todo List

- [ ] Setup Kafka/RabbitMQ (docker-compose)
- [ ] Implement OutboxEventPublisher
- [ ] Implement event consumers in user-service
- [ ] Implement event consumers in wallet-service
- [ ] Implement BankAdapterFactory with circuit breaker
- [ ] Implement TokenizationService (PCI DSS)
- [ ] Update API Gateway JWT validation
- [ ] Add rate limiting per user (Bucket4j)
- [ ] Implement inter-service calls (user->wallet, wallet->user)
- [ ] Add correlation ID propagation
- [ ] Integration tests for event flow
- [ ] Load test with k6 or Gatling

## Success Criteria

1. KYC approval in user-service triggers wallet activation in wallet-service via event
2. P2P transfer publishes events for both sender debit and recipient credit
3. Bank adapter circuit breaker opens after 50% failure rate
4. API Gateway rejects requests with invalid JWT
5. Rate limiting enforced per user (100 requests/minute)
6. Idempotent event processing (no duplicate wallet activations)
7. Tokenization service stores no raw card data
8. Integration tests pass for critical paths

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cascade failure | Medium | High | Circuit breaker per bank/service |
| Event duplication | Medium | Medium | Idempotent event handlers |
| Kafka unavailable | Low | High | In-memory fallback for MVP |
| JWT validation bottleneck | Low | Medium | Cache valid tokens in Redis |

## Security Considerations

- **PCI DSS:** Tokenization vault for card data; no raw PAN storage
- **JWT Security:** Short-lived tokens, Redis blacklist for logout
- **mTLS:** Consider for service-to-service communication in prod
- **Secrets Management:** HashiCorp Vault for API keys, bank credentials

## Next Steps

- Phase 05: Admin & Reconciliation (can proceed in parallel with integration finishing)
- Production hardening: monitoring, alerting, autoscaling