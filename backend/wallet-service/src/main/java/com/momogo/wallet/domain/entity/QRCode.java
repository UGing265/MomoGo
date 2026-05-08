package com.momogo.wallet.domain.entity;

import com.momogo.wallet.domain.enums.QRCodeType;
import com.momogo.wallet.domain.enums.QRCodeStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "qr_codes")
@Getter
@Setter
@NoArgsConstructor
@Builder
public class QRCode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "wallet_id", nullable = false)
    private UUID walletId;

    @Enumerated(EnumType.STRING)
    @Column(name = "qr_type", nullable = false, length = 10)
    private QRCodeType qrType;

    @Column(name = "reference_id", unique = true, nullable = false, length = 100)
    private String referenceId;

    @Column(name = "amount")
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private QRCodeStatus status;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = QRCodeStatus.ACTIVE;
    }

    @PreUpdate
    protected void onUpdate() {
        // Status/expiresAt changes handled in service layer
    }
}