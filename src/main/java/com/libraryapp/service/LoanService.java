package com.libraryapp.service;

import com.libraryapp.dto.IssueLoanRequest;
import com.libraryapp.entity.Loan;

import java.util.List;

public interface LoanService {
    Loan issueLoan(IssueLoanRequest request);
    Loan returnLoan(Long loanId);
    List<Loan> getAllLoans();
    List<Loan> getLoansByMember(Long memberId);
    List<Loan> getOverdueLoans();
}
