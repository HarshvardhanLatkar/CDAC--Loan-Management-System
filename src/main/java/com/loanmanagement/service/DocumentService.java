package com.loanmanagement.service;

import com.loanmanagement.entity.Document;
import com.loanmanagement.entity.Loan;
import com.loanmanagement.enums.DocumentType;
import com.loanmanagement.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Objects;

@Service
public class DocumentService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final String ALLOWED_TYPE = "application/pdf";

    private final DocumentRepository documentRepository;
    private final LoanService loanService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public DocumentService(DocumentRepository documentRepository, LoanService loanService) {
        this.documentRepository = documentRepository;
        this.loanService = loanService;
    }

    @Transactional
    public Document uploadDocument(Long loanId, DocumentType documentType, MultipartFile file) throws IOException {
        if (!ALLOWED_TYPE.equals(file.getContentType())) {
            throw new RuntimeException("Only PDF files are allowed");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds 5MB limit");
        }

        Loan loan = loanService.getLoanById(loanId);
        Path loanDir = Paths.get(uploadDir, String.valueOf(loanId));
        Files.createDirectories(loanDir);

        String originalName = Objects.requireNonNull(file.getOriginalFilename());
        String fileName = documentType.name().toLowerCase() + "_" + System.currentTimeMillis() + "_" + originalName;
        Path filePath = loanDir.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        documentRepository.findByLoanIdAndDocumentType(loanId, documentType)
                .ifPresent(existing -> {
                    try { Files.deleteIfExists(Paths.get(existing.getFilePath())); }
                    catch (IOException e) { System.err.println("Failed to delete old file: " + e.getMessage()); }
                    documentRepository.delete(existing);
                });

        Document document = new Document();
        document.setLoan(loan);
        document.setDocumentType(documentType);
        document.setFileName(originalName);
        document.setFilePath(filePath.toString());
        document.setFileSize(file.getSize());

        return documentRepository.save(document);
    }

    public List<Document> getDocumentsByLoan(Long loanId) {
        return documentRepository.findByLoanId(loanId);
    }

    public long getDocumentCount(Long loanId) {
        return documentRepository.countByLoanId(loanId);
    }
}
