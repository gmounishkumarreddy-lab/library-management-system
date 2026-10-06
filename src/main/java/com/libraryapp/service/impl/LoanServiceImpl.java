package com.libraryapp.service.impl;

import com.libraryapp.dto.IssueLoanRequest;
import com.libraryapp.entity.Book;
import com.libraryapp.entity.Loan;
import com.libraryapp.entity.Member;
import com.libraryapp.exception.BookUnavailableException;
import com.libraryapp.exception.ResourceNotFoundException;
import com.libraryapp.repository.BookRepository;
import com.libraryapp.repository.LoanRepository;
import com.libraryapp.repository.MemberRepository;
import com.libraryapp.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Handles the borrow / return workflow: checks availability, decrements /
 * increments copies, and tracks due dates & overdue status.
 * Mirrors the layered (Controller -> Service -> Repository) pattern.
 */
@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private static final int DEFAULT_LOAN_DAYS = 14;

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    @Override
    public Loan issueLoan(IssueLoanRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + request.getBookId()));
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + request.getMemberId()));

        if (book.getAvailableCopies() == null || book.getAvailableCopies() <= 0) {
            throw new BookUnavailableException("No available copies of \"" + book.getTitle() + "\" to issue");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        int loanDays = request.getLoanDays() != null ? request.getLoanDays() : DEFAULT_LOAN_DAYS;

        Loan loan = new Loan();
        loan.setBook(book);
        loan.setMember(member);
        loan.setIssueDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(loanDays));
        loan.setStatus(Loan.LoanStatus.ISSUED);

        return loanRepository.save(loan);
    }

    @Override
    public Loan returnLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with id: " + loanId));

        if (loan.getStatus() == Loan.LoanStatus.RETURNED) {
            throw new BookUnavailableException("This loan has already been returned");
        }

        loan.setReturnDate(LocalDate.now());
        loan.setStatus(Loan.LoanStatus.RETURNED);
        loanRepository.save(loan);

        Book book = loan.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return loan;
    }

    @Override
    public List<Loan> getAllLoans() {
        refreshOverdueStatuses();
        return loanRepository.findAll();
    }

    @Override
    public List<Loan> getLoansByMember(Long memberId) {
        return loanRepository.findByMemberId(memberId);
    }

    @Override
    public List<Loan> getOverdueLoans() {
        refreshOverdueStatuses();
        return loanRepository.findByStatus(Loan.LoanStatus.OVERDUE);
    }

    /** Marks any ISSUED loan whose due date has passed as OVERDUE. */
    private void refreshOverdueStatuses() {
        List<Loan> issued = loanRepository.findByStatus(Loan.LoanStatus.ISSUED);
        LocalDate today = LocalDate.now();
        for (Loan loan : issued) {
            if (loan.getDueDate() != null && loan.getDueDate().isBefore(today)) {
                loan.setStatus(Loan.LoanStatus.OVERDUE);
                loanRepository.save(loan);
            }
        }
    }
}
