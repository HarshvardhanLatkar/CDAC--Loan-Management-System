package com.loanmanagement.repository;

import com.loanmanagement.entity.Loan;
import com.loanmanagement.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Loan> findByStatusOrderByCreatedAtDesc(LoanStatus status);
    List<Loan> findAllByOrderByCreatedAtDesc();

    @Query("SELECT SUM(l.loanAmount) FROM Loan l WHERE l.status = 'APPROVED'")
    BigDecimal getTotalDisbursedAmount();

    long countByStatus(LoanStatus status);
}
