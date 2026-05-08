package com.momogo.user.domain.repository;

import com.momogo.user.domain.entity.LinkedBank;
import com.momogo.user.domain.entity.LinkStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface LinkedBankRepository extends JpaRepository<LinkedBank, UUID> {
    List<LinkedBank> findByUserId(UUID userId);
    List<LinkedBank> findByUserIdAndLinkStatus(UUID userId, LinkStatus linkStatus);
    long countByUserIdAndLinkStatus(UUID userId, LinkStatus linkStatus);
}