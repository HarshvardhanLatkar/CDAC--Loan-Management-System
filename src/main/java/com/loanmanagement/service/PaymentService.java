package com.loanmanagement.service;

import com.loanmanagement.entity.Loan;
import com.loanmanagement.entity.Payment;
import com.loanmanagement.enums.LoanStatus;
import com.loanmanagement.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final LoanService loanService;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    public PaymentService(PaymentRepository paymentRepository, LoanService loanService, RazorpayClient razorpayClient) {
        this.paymentRepository = paymentRepository;
        this.loanService = loanService;
        this.razorpayClient = razorpayClient;
    }

    @Transactional
    public Payment createOrder(Long loanId) throws Exception {
        Loan loan = loanService.getLoanById(loanId);
        if (loan.getStatus() != LoanStatus.APPROVED) {
            throw new RuntimeException("Cannot pay EMI for non-approved loan");
        }

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", loan.getEmi().multiply(BigDecimal.valueOf(100)).intValue());
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "emi_loan_" + loanId + "_" + System.currentTimeMillis());

        Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        Payment payment = new Payment();
        payment.setLoan(loan);
        payment.setAmount(loan.getEmi());
        payment.setRazorpayOrderId(razorpayOrder.get("id"));
        payment.setStatus("PENDING");

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) throws Exception {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        JSONObject attributes = new JSONObject();
        attributes.put("razorpay_order_id", razorpayOrderId);
        attributes.put("razorpay_payment_id", razorpayPaymentId);
        attributes.put("razorpay_signature", razorpaySignature);

        boolean isValid = Utils.verifyPaymentSignature(attributes, razorpaySecret);

        if (isValid) {
            payment.setRazorpayPaymentId(razorpayPaymentId);
            payment.setRazorpaySignature(razorpaySignature);
            payment.setStatus("SUCCESS");
        } else {
            payment.setStatus("FAILED");
        }

        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByLoan(Long loanId) {
        return paymentRepository.findByLoanIdOrderByPaymentDateDesc(loanId);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByPaymentDateDesc();
    }

    public long getPaidEmiCount(Long loanId) {
        return paymentRepository.countByLoanIdAndStatus(loanId, "SUCCESS");
    }

    public BigDecimal getTotalCollected() {
        BigDecimal total = paymentRepository.getTotalCollectedAmount();
        return total != null ? total : BigDecimal.ZERO;
    }
}
