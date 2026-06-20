package com.loanmanagement.controller;

import com.loanmanagement.entity.Loan;
import com.loanmanagement.entity.User;
import com.loanmanagement.enums.DocumentType;
import com.loanmanagement.enums.LoanStatus;
import com.loanmanagement.repository.UserRepository;
import com.loanmanagement.service.DocumentService;
import com.loanmanagement.service.LoanService;
import com.loanmanagement.service.PaymentService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/user")
public class LoanController {

    private final LoanService loanService;
    private final DocumentService documentService;
    private final PaymentService paymentService;
    private final UserRepository userRepository;

    public LoanController(LoanService loanService, DocumentService documentService,
                          PaymentService paymentService, UserRepository userRepository) {
        this.loanService = loanService;
        this.documentService = documentService;
        this.paymentService = paymentService;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public String dashboard(Principal principal, Model model) {
        User user = getUser(principal);
        List<Loan> loans = loanService.getLoansByUser(user.getId());

        long activeCount = loans.stream().filter(l -> l.getStatus() == LoanStatus.APPROVED).count();
        long pendingCount = loans.stream().filter(l -> l.getStatus() == LoanStatus.PENDING).count();

        model.addAttribute("user", user);
        model.addAttribute("loans", loans);
        model.addAttribute("activeCount", activeCount);
        model.addAttribute("pendingCount", pendingCount);
        return "user/dashboard";
    }

    @GetMapping("/apply-loan")
    public String applyLoanPage() {
        return "user/apply-loan";
    }

    @PostMapping("/apply-loan")
    public String applyLoan(@RequestParam BigDecimal loanAmount,
                            @RequestParam Integer tenureMonths,
                            Principal principal,
                            RedirectAttributes redirectAttributes) {
        User user = getUser(principal);
        try {
            Loan loan = loanService.applyForLoan(user, loanAmount, tenureMonths);
            redirectAttributes.addFlashAttribute("success",
                    "Loan #" + loan.getId() + " submitted! EMI: ₹" + loan.getEmi());
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/user/apply-loan";
        }
        return "redirect:/user/my-loans";
    }

    @GetMapping("/my-loans")
    public String myLoans(Principal principal, Model model) {
        User user = getUser(principal);
        List<Loan> loans = loanService.getLoansByUser(user.getId());
        loans.forEach(loan -> loan.setDocuments(documentService.getDocumentsByLoan(loan.getId())));
        model.addAttribute("loans", loans);
        return "user/my-loans";
    }

    @GetMapping("/upload-docs")
    public String uploadDocsPage(Principal principal, Model model) {
        User user = getUser(principal);
        model.addAttribute("loans", loanService.getLoansByUser(user.getId()));
        return "user/upload-docs";
    }

    @PostMapping("/upload-docs")
    public String uploadDoc(@RequestParam Long loanId,
                            @RequestParam DocumentType documentType,
                            @RequestParam MultipartFile file,
                            RedirectAttributes redirectAttributes) {
        try {
            documentService.uploadDocument(loanId, documentType, file);
            redirectAttributes.addFlashAttribute("success", "Document uploaded successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/user/upload-docs";
    }

    @GetMapping("/payments")
    public String paymentsPage(Principal principal, Model model) {
        User user = getUser(principal);
        List<Loan> approvedLoans = loanService.getLoansByUser(user.getId())
                .stream()
                .filter(l -> l.getStatus() == LoanStatus.APPROVED)
                .toList();
        model.addAttribute("loans", approvedLoans);
        return "user/payments";
    }

    private User getUser(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
