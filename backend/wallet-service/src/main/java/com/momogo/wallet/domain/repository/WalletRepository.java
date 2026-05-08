package com.momogo.wallet.domain.repository;

import com.momogo.wallet.domain.entity.Wallet;
import com.momogo.wallet.domain.entity.WalletStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, UUID> {

    Optional<Wallet> findByUserId(UUID userId);

    Optional<Wallet> findByUserIdAndStatus(UUID userId, WalletStatus status);
}