---
title: "Wallet & User Service - Code-First SQL Generation"
description: "Generate SQL migrations from Java entities for wallet and user service with sample data"
status: pending
priority: P1
effort: 4h
branch: dev
tags: [backend, database, wallet-service, user-service]
created: 2026-05-09
---

# Wallet & User Service - Code-First SQL Generation Plan

## Overview

Generate SQL migrations using code-first approach for both wallet-service and user-service, create sample data with admin users, and prepare for P2P implementation.

## Phases

| # | Phase | Status | Effort | Link |
|---|-------|--------|--------|------|
| 1 | Code-First Entities (user-service) | Completed | 1h | [phase-01](./phase-01-user-service-entities.md) |
| 2 | Code-First Entities (wallet-service) | Completed | 1h | [phase-02](./phase-02-wallet-service-entities.md) |
| 3 | Sample Data & Admin Users | Completed | 1h | [phase-03](./phase-03-sample-data.md) |
| 4 | P2P Research & Preparation | Pending | 1h | [phase-04](./phase-04-p2p-research.md) |

## Key Deliverables

- user-service entities: User, KycSubmission, LinkedBank, TransactionPin, AdminUser
- wallet-service entities: Wallet, Transaction, QRCode
- SQL migrations generated from entities
- Sample data SQL in `database/` folder
- Sample users: admin (Hihihi123@), shiro (Hihihi123@)

## Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Daily aggregate storage | **Query transactions** | Simple, no extra infra, DB is source of truth |
| Service communication | **All via gateway** | Security, monitoring, single entry point |
| PIN verification | **Live verify** | Simpler, always fresh, no token management risk |

## Dependencies

- Java 17+
- Spring Boot 3.x
- PostgreSQL
- Flyway for migrations