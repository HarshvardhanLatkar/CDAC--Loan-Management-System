package com.loanmanagement.service;

import com.loanmanagement.entity.Loan;
import com.loanmanagement.entity.User;
import com.loanmanagement.enums.LoanStatus;
import com.loanmanagement.repository.LoanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class LoanService {

    private static final Logger log = LoggerFactory.getLogger(LoanService.class);

    private final LoanRepository loanRepository;

    @Value("${app.loan.interest-rate}")
    private double defaultInterestRate;

    @Value("${app.loan.currency}")
    private String defaultCurrency;

    public LoanService(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public BigDecimal calculateEMI(BigDecimal principal, double annualRate, int tenureMonths) {
        double r = annualRate / 12.0 / 100.0;
        if (r == 0) {
            return principal.divide(BigDecimal.valueOf(tenureMonths), 2, RoundingMode.HALF_UP);
        }
        double numerator = r * Math.pow(1 + r, tenureMonths);
        double denominator = Math.pow(1 + r, tenureMonths) - 1;
        double emi = principal.doubleValue() * (numerator / denominator);
        return BigDecimal.valueOf(emi).setScale(2, RoundingMode.HALF_UP);
    }

    @Transactional
    public Loan applyForLoan(User user, BigDecimal loanAmount, int tenureMonths) {
        BigDecimal interestRate = BigDecimal.valueOf(defaultInterestRate);
        BigDecimal emi = calculateEMI(loanAmount, defaultInterestRate, tenureMonths);

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setLoanAmount(loanAmount);
        loan.setInterestRate(interestRate);
        loan.setTenureMonths(tenureMonths);
        loan.setEmi(emi);
        loan.setStatus(LoanStatus.PENDING);
        loan.setCurrency(defaultCurrency);

        return loanRepository.save(loan);
    }

    public List<Loan> getLoansByUser(Long userId) {
        return loanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Loan> getPendingLoans() {
        return loanRepository.findByStatusOrderByCreatedAtDesc(LoanStatus.PENDING);
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAllByOrderByCreatedAtDesc();
    }

    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + id));
    }

    @Transactional
    public Loan approveLoan(Long loanId) {
        Loan loan = getLoanById(loanId);
        if (loan.getStatus() != LoanStatus.PENDING)
            throw new RuntimeException("Loan is not in PENDING status");
        loan.setStatus(LoanStatus.APPROVED);
        return loanRepository.save(loan);
    }

    @Transactional
    public Loan rejectLoan(Long loanId, String reason) {
        Loan loan = getLoanById(loanId);
        if (loan.getStatus() != LoanStatus.PENDING)
            throw new RuntimeException("Loan is not in PENDING status");
        loan.setStatus(LoanStatus.REJECTED);
        loan.setRejectionReason(reason);
        return loanRepository.save(loan);
    }

    public long countByStatus(LoanStatus status) {
        return loanRepository.countByStatus(status);
    }

    public BigDecimal getTotalDisbursed() {
        BigDecimal total = loanRepository.getTotalDisbursedAmount();
        return total != null ? total : BigDecimal.ZERO;
    }
}
