import axios from 'axios';

// Talks to the Spring Boot backend (Controller -> Service -> Repository layers).
// CRA's "proxy" field in package.json forwards /api calls to :8080 in development.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ---- Books ----
export const getBooks = () => api.get('/books');
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// ---- Members ----
export const getMembers = () => api.get('/members');
export const createMember = (data) => api.post('/members', data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data);
export const deleteMember = (id) => api.delete(`/members/${id}`);

// ---- Loans ----
export const getLoans = () => api.get('/loans');
export const issueLoan = (data) => api.post('/loans/issue', data);
export const returnLoan = (id) => api.post(`/loans/${id}/return`);
export const getOverdueLoans = () => api.get('/loans/overdue');

export default api;
