package com.libraryapp.controller;

import com.libraryapp.dto.IssueLoanRequest;
import com.libraryapp.entity.Loan;
import com.libraryapp.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/issue")
    public ResponseEntity<Loan> issueLoan(@Valid @RequestBody IssueLoanRequest request) {
        return new ResponseEntity<>(loanService.issueLoan(request), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<Loan> returnLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.returnLoan(id));
    }

    @GetMapping
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Loan>> getLoansByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(loanService.getLoansByMember(memberId));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Loan>> getOverdueLoans() {
        return ResponseEntity.ok(loanService.getOverdueLoans());
    }
}
