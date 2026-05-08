package com.momogo.wallet.domain.repository;

import com.momogo.wallet.domain.entity.Transaction;
import com.momogo.wallet.domain.entity.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    Optional<Transaction> findByReferenceCode(String referenceCode);

    List<Transaction> findBySenderWalletId(UUID senderWalletId);

    List<Transaction> findByReceiverWalletId(UUID receiverWalletId);

    List<Transaction> findByStatus(TransactionStatus status);

    List<Transaction> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}