# Phase 01: User Service - Code-First Entities

## Overview

**Priority:** P1 (High)
**Status:** Completed
**Effort:** 1h

Create Java JPA entities for user-service that will generate SQL migrations.

## Requirements

### Entities to Create

1. **User** (`domain/entity/User.java`)
   - id (UUID, PK)
   - phoneNumber (VARCHAR 15, UNIQUE)
   - email (VARCHAR 255, UNIQUE)
   - fullName (VARCHAR 255)
   - passwordHash (VARCHAR 255)
   - status (VARCHAR 20) - PENDING, ACTIVE, SUSPENDED
   - kycStatus (VARCHAR 20) - PENDING, APPROVED, REJECTED
   - createdAt, updatedAt (TIMESTAMP)

2. **KycSubmission** (`domain/entity/KycSubmission.java`)
   - id (UUID, PK)
   - userId (UUID, FK → User)
   - cccdNumber (VARCHAR 50, encrypted)
   - frontImageUrl, backImageUrl (VARCHAR 500)
   - status (VARCHAR 20)
   - submittedAt, reviewedAt (TIMESTAMP)
   - adminNotes (TEXT)

3. **LinkedBank** (`domain/entity/LinkedBank.java`)
   - id (UUID, PK)
   - userId (UUID, FK → User)
   - bankCode (VARCHAR 10) - VCB, TCB
   - accountToken (VARCHAR 500) - encrypted
   - accountHolderName (VARCHAR 255)
   - lastFourDigits (VARCHAR 4)
   - linkStatus (VARCHAR 20) - LINKED, UNLINKED
   - verifiedAt, linkedAt, unlinkedAt (TIMESTAMP)

4. **TransactionPin** (`domain/entity/TransactionPin.java`)
   - id (UUID, PK)
   - userId (UUID, FK → User, UNIQUE)
   - hashedPin (VARCHAR 255)
   - salt (VARCHAR 64)
   - failCount (INTEGER)
   - lockedUntil (TIMESTAMP)
   - createdAt, updatedAt (TIMESTAMP)

5. **AdminUser** (`domain/entity/AdminUser.java`)
   - id (UUID, PK)
   - username (VARCHAR 100, UNIQUE)
   - passwordHash (VARCHAR 255)
   - status (VARCHAR 20) - ACTIVE, SUSPENDED
   - createdAt (TIMESTAMP)

## Implementation Steps

1. Create package structure under `user-service/src/main/java/com/momogo/user/domain/entity/`

2. Write each entity with:
   - JPA annotations (@Entity, @Table, @Id, @GeneratedValue)
   - Column annotations with constraints
   - Relationships (@ManyToOne, @OneToOne)
   - Lombok annotations (@Getter, @Setter, @NoArgsConstructor)

3. Create repository interfaces under `domain/repository/`

4. Configure Hibernate output for SQL generation

## Sample Entity Structure

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "phone_number", unique = true, nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status = UserStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    private KycStatus kycStatus = KycStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
```

## Todo List

- [ ] Create User entity
- [ ] Create KycSubmission entity
- [ ] Create LinkedBank entity
- [ ] Create TransactionPin entity
- [ ] Create AdminUser entity
- [ ] Create repository interfaces
- [ ] Configure entity attributes for SQL generation

## Success Criteria

- All entities compile without errors
- SQL can be generated from entities using Hibernate ddl-auto or jOOQ
- Entities match ERD specification

## Next Steps

Phase 02 depends on this phase completing successfully.