package com.momogo.user.domain.repository;

import com.momogo.user.domain.entity.TransactionPin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionPinRepository extends JpaRepository<TransactionPin, UUID> {
    Optional<TransactionPin> findByUserId(UUID userId);
    boolean existsByUserId(UUID userId);
}