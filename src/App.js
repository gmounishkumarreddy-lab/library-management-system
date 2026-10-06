import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import MemberList from './components/MemberList';
import LoanList from './components/LoanList';
import './App.css';

export default function App() {
  const [active, setActive] = useState('books');

  return (
    <div>
      <Navbar active={active} onNavigate={setActive} />
      <main className="container">
        {active === 'books' && <BookList />}
        {active === 'members' && <MemberList />}
        {active === 'loans' && <LoanList />}
      </main>
    </div>
  );
}
