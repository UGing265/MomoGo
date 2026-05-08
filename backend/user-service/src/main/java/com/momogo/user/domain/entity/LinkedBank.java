package com.momogo.user.domain.entity;

import com.momogo.user.domain.enums.LinkStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "linked_banks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LinkedBank {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "bank_code", nullable = false, length = 10)
    private String bankCode;

    @Column(name = "account_token", nullable = false, length = 500)
    private String accountToken;

    @Column(name = "account_holder_name", nullable = false, length = 255)
    private String accountHolderName;

    @Column(name = "last_four_digits", nullable = false, length = 4)
    private String lastFourDigits;

    @Enumerated(EnumType.STRING)
    @Column(name = "link_status", nullable = false, length = 20)
    @Builder.Default
    private LinkStatus linkStatus = LinkStatus.LINKED;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "linked_at", nullable = false)
    private LocalDateTime linkedAt;

    @Column(name = "unlinked_at")
    private LocalDateTime unlinkedAt;

    @PrePersist
    protected void onCreate() {
        if (linkedAt == null) {
            linkedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        // linkStatus changes handled in service layer
    }
}