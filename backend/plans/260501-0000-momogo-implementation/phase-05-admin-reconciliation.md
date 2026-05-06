# Phase 05: Admin & Reconciliation

## Context Links

- SRS: `D:\AShiroru\ProgramCode\Project\Team\MomoGo\docs\srs.md`
- Phase 02: `phase-02-user-service-core.md`
- Phase 04: `phase-04-integration.md`

## Overview

- **Priority:** P1 (High)
- **Status:** pending
- **Description:** Implement admin dashboard functionality, KYC approval queue with SLA tracking, daily reconciliation reports, and transaction monitoring with flagging.

## Key Insights from Research

1. **KYC SLA:** 24-hour review window (BR-ADM-01) - need deadline tracking
2. **Transaction Flagging:** > 50M VND transactions require manual review (BR-ADM-02)
3. **Reconciliation:** Daily report due by 09:00 AM next business day (BR-ADM-03)
4. **Dashboard Aggregates:** Total system balance, daily volume, active users

## Requirements

### Functional (FR-ADM-01, FR-ADM-02, FR-ADM-03)

1. **Account Management (FR-ADM-01)**
   - View pending KYC submissions with submission time
   - SLA countdown timer (24h deadline)
   - Approve/reject with notes
   - View user details and linked bank accounts
   - Suspend/reactivate accounts

2. **Dashboard & Monitoring (FR-ADM-02)**
   - Total system wallet balance
   - Total bank account balances (aggregated via bank APIs)
   - Daily transaction volume and count
   - Active user count
   - Real-time transaction feed

3. **Transaction Monitoring (FR-ADM-02.2)**
   - Flag transactions > 50M VND (BR-ADM-02)
   - Alert on anomalous patterns (configurable thresholds)
   - Manual review queue for flagged transactions

4. **Reconciliation (FR-ADM-03)**
   - Daily transaction file export (CSV/Excel)
   - Compare wallet balances with bank statement data
   - Identify and report discrepancies
   - Due by 09:00 AM next business day

### Non-Functional

- Admin actions logged with audit trail
- Role-based access (application-level, no DB role column)
- Dashboard load time < 2 seconds
- Reconciliation report generation < 30 seconds

## Domain Entities

```
AdminUser (aggregate root)
├── id: UUID
├── username: String (unique)
├── passwordHash: String (Argon2)
├── email: String
├── status: AdminStatus (ACTIVE|SUSPENDED)
├── lastLoginAt: Instant
└── createdAt: Instant

KycApprovalTask (entity)
├── id: UUID
├── kycSubmissionId: UUID (FK)
├── assignedAdminId: UUID (FK, nullable)
├── status: TaskStatus (PENDING|IN_REVIEW|COMPLETED|EXPIRED)
├── priority: Priority (HIGH|NORMAL|LOW)
├── deadlineAt: Instant (submittedAt + 24h)
├── slaBreached: Boolean
├── completedAt: Instant
└── notes: String

FlaggedTransaction (entity)
├── id: UUID
├── transactionId: UUID (FK)
├── reason: FlagReason (HIGH_VALUE|SUSPICIOUS_PATTERN|VERIFICATION_REQUIRED)
├── status: FlagStatus (PENDING|REVIEWED|CLEARED)
├── flaggedAt: Instant
├── reviewedBy: UUID (FK, nullable)
├── reviewedAt: Instant
└── reviewNotes: String

ReconciliationReport (entity)
├── id: UUID
├── reportDate: LocalDate
├── totalDeposits: Long
├── totalWithdrawals: Long
├── totalP2PTransfers: Long
├── netWalletChange: Long
├── bankStatementTotal: Long (manual entry)
├── discrepancyAmount: Long
├── discrepancyCount: Integer
├── status: ReportStatus (DRAFT|PRELIMINARY|FINAL)
├── generatedAt: Instant
└── approvedBy: UUID (FK, nullable)
```

## Application Layer (Use Cases)

```
GetKycQueueUseCase
├── Input: filter (status, fromDate, toDate), page, size
├── Output: Page<KycQueueItem>
└── Steps: query pending KYC with SLA info

AssignKycTaskUseCase
├── Input: kycTaskId, adminId
├── Output: TaskAssignmentResult
└── Steps: validate admin status, assign task

ApproveKycUseCase (from Phase 02, extended)
├── Input: kycId, adminId, approved, notes
├── Output: KYCApprovalResult
└── Steps: update task status, update user status, trigger wallet activation

GetDashboardStatsUseCase
├── Input: none
├── Output: DashboardStats
└── Steps: aggregate from wallet-service, user-service

GetFlaggedTransactionsUseCase
├── Input: status, page, size
├── Output: Page<FlaggedTransactionItem>
└── Steps: query flagged transactions

ReviewFlaggedTransactionUseCase
├── Input: flagId, adminId, cleared, notes
├── Output: ReviewResult
└── Steps: update flag status, log review action

GenerateReconciliationReportUseCase
├── Input: reportDate
├── Output: ReconciliationReport
└── Steps: aggregate transactions, calculate totals, compare with bank

ExportReconciliationReportUseCase
├── Input: reportId, format (CSV|EXCEL)
├── Output: FileDownload
└── Steps: generate file, store temporarily, return download URL
```

## Presentation Layer

```
Admin REST Controllers
├── AdminDashboardController (GET /api/v1/admin/dashboard)
├── AdminKycController (GET /api/v1/admin/kyc/queue, POST /api/v1/admin/kyc/{id}/review)
├── AdminTransactionController (GET /api/v1/admin/transactions/flagged, POST /api/v1/admin/transactions/{id}/review)
└── AdminReconciliationController (GET /api/v1/admin/reconciliation, POST /api/v1/admin/reconciliation/generate)
```

## Admin Permissions (application-level, no DB role column)

For MVP, admin permissions are managed via application configuration or external IdP.
Future: add role column if needed.

| Permission | SUPER | REVIEWER | VIEWER |
|------------|-------|----------|--------|
| Dashboard | View | View | View |
| KYC Queue | View | View | View |
| Approve KYC | Yes | Yes | No |
| Flagged TX | Review | Review | View |
| Reconciliation | Generate/Approve | View | View |

## SLA Tracking Implementation

```java
// KYC SLA deadline calculation
public Instant calculateSlaDeadline(KycSubmission submission) {
    return submission.getSubmittedAt().plus(24, ChronoUnit.HOURS);
}

// Query overdue submissions
@Query("SELECT k FROM KycSubmission k WHERE k.status = 'SUBMITTED' AND k.submittedAt < :deadline")
List<KycSubmission> findOverdueSubmissions(@Param("deadline") Instant deadline);

// Cron job for SLA breach notifications
@Scheduled(cron = "0 */15 * * * *") // Every 15 minutes
public void checkSlaBreaches() {
    List<KycSubmission> overdue = kycRepository.findOverdueSubmissions(Instant.now());
    for (KycSubmission kyc : overdue) {
        notificationService.sendSlaAlert(kyc);
    }
}
```

## Transaction Flagging Rules

```java
public class TransactionFlagger {
    public FlagReason checkFlagging(Transaction tx) {
        // Rule 1: High value (> 50M VND)
        if (tx.getAmount().compareTo(new Money(50_000_000L)) > 0) {
            return FlagReason.HIGH_VALUE;
        }

        // Rule 2: Suspicious pattern (configurable)
        if (suspiciousPatternDetector.isSuspicious(tx)) {
            return FlagReason.SUSPICIOUS_PATTERN;
        }

        // Rule 3: Manual verification required
        if (tx.requiresManualVerification()) {
            return FlagReason.VERIFICATION_REQUIRED;
        }

        return null; // No flag
    }
}
```

## Reconciliation Report Structure

```csv
# Daily Reconciliation Report - 2026-05-01
Generated: 2026-05-02 08:30:00

## Summary
Total Deposits: 1,500,000,000 VND (150 transactions)
Total Withdrawals: 800,000,000 VND (80 transactions)
Total P2P Transfers: 300,000,000 VND (120 transactions)
Net Wallet Change: +700,000,000 VND

## Discrepancies
Count: 2
Total Discrepancy: 50,000 VND
- TX-001: 25,000 VND (pending bank confirmation)
- TX-002: 25,000 VND (pending bank confirmation)

## Flagged Transactions
Count: 5
Total Flagged Value: 350,000,000 VND

## Action Required
- Review 2 discrepancies before 09:00 AM
- Review 5 flagged transactions
```

## Implementation Steps

1. **Admin User Management**
   - AdminUser entity and repository
   - Password hashing with Argon2
   - Role-based access control (RBAC)
   - Login audit logging

2. **KYC Queue with SLA Tracking**
   - KycApprovalTask entity
   - Deadline calculation (submittedAt + 24h)
   - Scheduled job for SLA breach alerts
   - Priority assignment (HIGH if approaching deadline)

3. **Dashboard Aggregates**
   - Aggregated wallet balance query
   - Daily transaction volume/count
   - Active user count
   - Real-time transaction feed (WebSocket or SSE)

4. **Transaction Flagging**
   - TransactionFlagger service
   - FlaggedTransaction entity and repository
   - Automatic flagging on transaction creation (>50M)
   - Manual review workflow

5. **Reconciliation Report**
   - Daily aggregation job (scheduled at midnight)
   - Bank statement comparison (manual CSV upload)
   - Discrepancy detection and reporting
   - Export to CSV/Excel

6. **Admin REST Controllers**
   - JWT authentication for admin users
   - Role-based authorization
   - Pagination for large datasets
   - Audit logging on all mutations

## Todo List

- [ ] Create AdminUser entity and repository
- [ ] Implement admin status-based access (application-level)
- [ ] Create KycApprovalTask entity with SLA tracking
- [ ] Implement GetKycQueueUseCase with SLA info
- [ ] Create scheduled SLA breach notification job
- [ ] Implement GetDashboardStatsUseCase
- [ ] Create FlaggedTransaction entity
- [ ] Implement TransactionFlagger service
- [ ] Implement GetFlaggedTransactionsUseCase
- [ ] Create ReconciliationReport entity
- [ ] Implement GenerateReconciliationReportUseCase
- [ ] Implement ExportReconciliationReportUseCase (CSV/Excel)
- [ ] Create Admin REST controllers
- [ ] Add audit logging for admin actions
- [ ] Write unit tests for admin use cases

## Success Criteria

1. Admin can view KYC queue with 24h SLA countdown
2. Admin can approve/reject KYC with admin status check (no role-based RBAC for MVP)
3. Transactions > 50M VND automatically flagged
4. Dashboard shows real-time aggregates (< 2s load)
5. Daily reconciliation report generated and exportable
6. All admin actions logged with audit trail
7. SLA breach alerts sent at 24h deadline
8. Unit tests pass for admin use cases

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| SLA breach without alert | Low | High | Multiple notification channels |
| Reconciliation discrepancies | Medium | Medium | Automated detection + manual review queue |
| Admin credential compromise | Low | Critical | MFA required for admin login, audit logging |

## Security Considerations

- **Admin MFA:** Require OTP for admin login (even for VIEWER role)
- **Audit Trail:** All admin actions logged (who, what, when, target user)
- **RBAC:** Strict enforcement of role permissions
- **Session:** 15-minute timeout for admin sessions
- **Password Policy:** Minimum 12 chars, complexity requirements

## Next Steps

- Production hardening: monitoring, alerting, autoscaling
- Mobile app integration (Phase 06 - future)
- Additional bank integrations (Phase 07 - future)