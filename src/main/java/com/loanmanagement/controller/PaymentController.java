package com.loanmanagement.controller;

import com.loanmanagement.entity.Payment;
import com.loanmanagement.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order/{loanId}")
    public ResponseEntity<Map<String, Object>> createOrder(@PathVariable Long loanId) {
        try {
            Payment payment = paymentService.createOrder(loanId);
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", payment.getRazorpayOrderId());
            response.put("amount", payment.getAmount());
            response.put("currency", "INR");
            response.put("razorpayKeyId", razorpayKeyId);
            response.put("paymentId", payment.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> paymentDetails) {
        try {
            Payment payment = paymentService.verifyPayment(
                    paymentDetails.get("razorpay_order_id"),
                    paymentDetails.get("razorpay_payment_id"),
                    paymentDetails.get("razorpay_signature"));
            Map<String, Object> response = new HashMap<>();
            response.put("status", payment.getStatus());
            response.put("paymentId", payment.getRazorpayPaymentId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
