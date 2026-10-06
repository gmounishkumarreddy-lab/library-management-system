package com.libraryapp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Payload used to issue (borrow) a book to a member.
 */
@Data
public class IssueLoanRequest {

    @NotNull(message = "Book id is required")
    private Long bookId;

    @NotNull(message = "Member id is required")
    private Long memberId;

    /** Optional loan period in days; defaults to 14 if not provided. */
    private Integer loanDays;
}
