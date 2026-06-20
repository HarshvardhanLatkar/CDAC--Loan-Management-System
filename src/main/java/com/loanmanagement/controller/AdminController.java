package com.loanmanagement.controller;

import com.loanmanagement.enums.LoanStatus;
import com.loanmanagement.repository.UserRepository;
import com.loanmanagement.service.DocumentService;
import com.loanmanagement.service.LoanService;
import com.loanmanagement.service.PaymentService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final LoanService loanService;
    private final DocumentService documentService;
    private final PaymentService paymentService;
    private final UserRepository userRepository;

    public AdminController(LoanService loanService, DocumentService documentService,
                           PaymentService paymentService, UserRepository userRepository) {
        this.loanService = loanService;
        this.documentService = documentService;
        this.paymentService = paymentService;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("totalLoans", loanService.getAllLoans().size());
        model.addAttribute("pendingCount", loanService.countByStatus(LoanStatus.PENDING));
        model.addAttribute("approvedCount", loanService.countByStatus(LoanStatus.APPROVED));
        model.addAttribute("rejectedCount", loanService.countByStatus(LoanStatus.REJECTED));
        model.addAttribute("totalDisbursed", loanService.getTotalDisbursed());
        model.addAttribute("totalCollected", paymentService.getTotalCollected());
        model.addAttribute("users", userRepository.findAll());
        model.addAttribute("recentPayments", paymentService.getAllPayments());
        return "admin/dashboard";
    }

    @GetMapping("/loans")
    public String allLoans(Model model) {
        model.addAttribute("loans", loanService.getAllLoans());
        return "admin/all-loans";
    }

    @GetMapping("/review")
    public String reviewLoans(Model model) {
        var pendingLoans = loanService.getPendingLoans();
        pendingLoans.forEach(loan ->
            loan.setDocuments(documentService.getDocumentsByLoan(loan.getId()))
        );
        model.addAttribute("loans", pendingLoans);
        return "admin/review-loan";
    }

    @PostMapping("/loans/{id}/approve")
    public String approveLoan(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            loanService.approveLoan(id);
            redirectAttributes.addFlashAttribute("success", "Loan #" + id + " approved!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/admin/review";
    }

    @PostMapping("/loans/{id}/reject")
    public String rejectLoan(@PathVariable Long id,
                             @RequestParam String reason,
                             RedirectAttributes redirectAttributes) {
        try {
            loanService.rejectLoan(id, reason);
            redirectAttributes.addFlashAttribute("success", "Loan #" + id + " rejected.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/admin/review";
    }

    @GetMapping("/payments")
    public String allPayments(Model model) {
        model.addAttribute("payments", paymentService.getAllPayments());
        model.addAttribute("totalCollected", paymentService.getTotalCollected());
        return "admin/all-payments";
    }
}
