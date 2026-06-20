package com.loanmanagement.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class LoanApplicationDto {

    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "10000", message = "Minimum loan amount is 10000")
    @DecimalMax(value = "5000000", message = "Maximum loan amount is 5000000")
    private BigDecimal loanAmount;

    @NotNull(message = "Tenure is required")
    @Min(value = 3, message = "Minimum tenure is 3 months")
    @Max(value = 360, message = "Maximum tenure is 360 months")
    private Integer tenureMonths;

    public BigDecimal getLoanAmount() { return loanAmount; }
    public void setLoanAmount(BigDecimal loanAmount) { this.loanAmount = loanAmount; }
    public Integer getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }
}
