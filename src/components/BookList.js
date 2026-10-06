import React, { useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from '../services/api';

const emptyForm = { title: '', author: '', isbn: '', category: '', totalCopies: 1 };

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      setError('Could not load books. Is the backend running on :8080?');
    }
  };

  useEffect(() => { loadBooks(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, totalCopies: Number(form.totalCopies) };
      if (editingId) {
        await updateBook(editingId, payload);
      } else {
        await createBook(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category || '',
      totalCopies: book.totalCopies,
    });
    setEditingId(book.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    await deleteBook(id);
    loadBooks();
  };

  return (
    <div className="page">
      <h2>Books</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="card form-grid">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="totalCopies" type="number" min="1" placeholder="Total copies" value={form.totalCopies} onChange={handleChange} required />
        <button type="submit" className="btn-primary">
          {editingId ? 'Update Book' : 'Add Book'}
        </button>
        {editingId && (
          <button type="button" className="btn-secondary" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
            Cancel
          </button>
        )}
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th><th>Author</th><th>ISBN</th><th>Category</th><th>Available / Total</th><th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.isbn}</td>
              <td>{b.category}</td>
              <td>
                <span className={`badge ${b.availableCopies > 0 ? 'badge-active' : 'badge-closed'}`}>
                  {b.availableCopies} / {b.totalCopies}
                </span>
              </td>
              <td>
                <button className="link" onClick={() => handleEdit(b)}>Edit</button>
                <button className="link danger" onClick={() => handleDelete(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr><td colSpan="6" className="empty">No books yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
