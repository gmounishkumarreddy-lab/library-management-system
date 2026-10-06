import React, { useEffect, useState } from 'react';
import { getLoans, issueLoan, returnLoan, getBooks, getMembers } from '../services/api';

const emptyForm = { bookId: '', memberId: '', loanDays: 14 };

export default function LoanList() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const loadAll = async () => {
    try {
      const [loanRes, bookRes, memberRes] = await Promise.all([
        getLoans(), getBooks(), getMembers(),
      ]);
      setLoans(loanRes.data);
      setBooks(bookRes.data);
      setMembers(memberRes.data);
    } catch (err) {
      setError('Could not load data. Is the backend running on :8080?');
    }
  };

  useEffect(() => { loadAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await issueLoan(form);
      setForm(emptyForm);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue loan');
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnLoan(id);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
    }
  };

  const availableBooks = books.filter((b) => b.availableCopies > 0);

  const isOverdue = (loan) =>
    loan.status === 'ISSUED' && new Date(loan.dueDate) < new Date();

  return (
    <div className="page">
      <h2>Loans (Borrow / Return)</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="card form-grid">
        <select name="bookId" value={form.bookId} onChange={handleChange} required>
          <option value="">Select book</option>
          {availableBooks.map((b) => (
            <option key={b.id} value={b.id}>{b.title} ({b.availableCopies} available)</option>
          ))}
        </select>
        <select name="memberId" value={form.memberId} onChange={handleChange} required>
          <option value="">Select member</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}
        </select>
        <input name="loanDays" type="number" min="1" placeholder="Loan days" value={form.loanDays} onChange={handleChange} />
        <button type="submit" className="btn-primary">Issue Book</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Book</th><th>Member</th><th>Issue Date</th><th>Due Date</th>
            <th>Return Date</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {loans.map((l) => (
            <tr key={l.id}>
              <td>{l.book?.title}</td>
              <td>{l.member?.fullName}</td>
              <td>{l.issueDate}</td>
              <td>{l.dueDate}</td>
              <td>{l.returnDate || '—'}</td>
              <td>
                <span className={`badge ${
                  l.status === 'RETURNED' ? 'badge-active'
                  : isOverdue(l) || l.status === 'OVERDUE' ? 'badge-closed'
                  : 'badge-pending'
                }`}>
                  {l.status === 'ISSUED' && isOverdue(l) ? 'OVERDUE' : l.status}
                </span>
              </td>
              <td>
                {l.status !== 'RETURNED' && (
                  <button className="link" onClick={() => handleReturn(l.id)}>Return</button>
                )}
              </td>
            </tr>
          ))}
          {loans.length === 0 && (
            <tr><td colSpan="7" className="empty">No loans yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
