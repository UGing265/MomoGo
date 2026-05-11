package com.momogo.wallet.domain.repository;

import com.momogo.wallet.domain.entity.QRCode;
import com.momogo.wallet.domain.enums.QRCodeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QRCodeRepository extends JpaRepository<QRCode, UUID> {

    Optional<QRCode> findByReferenceId(String referenceId);

    List<QRCode> findByWalletId(UUID walletId);

    List<QRCode> findByStatus(QRCodeStatus status);

    List<QRCode> findByExpiresAtBeforeAndStatus(LocalDateTime now, QRCodeStatus status);
}