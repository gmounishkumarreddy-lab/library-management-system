import React, { useEffect, useState } from 'react';
import { getMembers, createMember, updateMember, deleteMember } from '../services/api';

const emptyForm = { fullName: '', email: '', phoneNumber: '', address: '' };

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data);
    } catch (err) {
      setError('Could not load members. Is the backend running on :8080?');
    }
  };

  useEffect(() => { loadMembers(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateMember(editingId, form);
      } else {
        await createMember(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save member');
    }
  };

  const handleEdit = (member) => {
    setForm({
      fullName: member.fullName,
      email: member.email,
      phoneNumber: member.phoneNumber,
      address: member.address || '',
    });
    setEditingId(member.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    await deleteMember(id);
    loadMembers();
  };

  return (
    <div className="page">
      <h2>Members</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="card form-grid">
        <input name="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phoneNumber" placeholder="Phone number" value={form.phoneNumber} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <button type="submit" className="btn-primary">
          {editingId ? 'Update Member' : 'Add Member'}
        </button>
        {editingId && (
          <button type="button" className="btn-secondary" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
            Cancel
          </button>
        )}
      </form>

      <table className="table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th></th></tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.fullName}</td>
              <td>{m.email}</td>
              <td>{m.phoneNumber}</td>
              <td>
                <button className="link" onClick={() => handleEdit(m)}>Edit</button>
                <button className="link danger" onClick={() => handleDelete(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {members.length === 0 && (
            <tr><td colSpan="4" className="empty">No members yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
