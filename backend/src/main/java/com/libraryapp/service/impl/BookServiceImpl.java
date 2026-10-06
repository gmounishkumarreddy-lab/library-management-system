package com.libraryapp.service.impl;

import com.libraryapp.entity.Book;
import com.libraryapp.exception.DuplicateResourceException;
import com.libraryapp.exception.ResourceNotFoundException;
import com.libraryapp.repository.BookRepository;
import com.libraryapp.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    @Override
    public Book addBook(Book book) {
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            throw new DuplicateResourceException("A book with ISBN " + book.getIsbn() + " already exists");
        }
        if (book.getAvailableCopies() == null) {
            book.setAvailableCopies(book.getTotalCopies());
        }
        return bookRepository.save(book);
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    @Override
    public Book updateBook(Long id, Book updated) {
        Book existing = getBookById(id);

        // Keep availableCopies consistent if totalCopies changes
        int copiesOnLoan = existing.getTotalCopies() - existing.getAvailableCopies();
        existing.setTitle(updated.getTitle());
        existing.setAuthor(updated.getAuthor());
        existing.setIsbn(updated.getIsbn());
        existing.setCategory(updated.getCategory());
        existing.setTotalCopies(updated.getTotalCopies());
        existing.setAvailableCopies(Math.max(0, updated.getTotalCopies() - copiesOnLoan));

        return bookRepository.save(existing);
    }

    @Override
    public void deleteBook(Long id) {
        Book existing = getBookById(id);
        bookRepository.delete(existing);
    }
}
