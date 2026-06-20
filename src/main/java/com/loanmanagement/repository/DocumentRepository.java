package com.loanmanagement.repository;

import com.loanmanagement.entity.Document;
import com.loanmanagement.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByLoanId(Long loanId);
    Optional<Document> findByLoanIdAndDocumentType(Long loanId, DocumentType documentType);
    long countByLoanId(Long loanId);
}
