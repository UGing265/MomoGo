package com.momogo.user.domain.repository;

import com.momogo.user.domain.entity.KycSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface KycSubmissionRepository extends JpaRepository<KycSubmission, UUID> {
    Optional<KycSubmission> findByUserId(UUID userId);
    boolean existsByUserId(UUID userId);
}