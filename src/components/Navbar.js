import React from 'react';

export default function Navbar({ active, onNavigate }) {
  const tabs = [
    { key: 'books', label: 'Books' },
    { key: 'members', label: 'Members' },
    { key: 'loans', label: 'Loans' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>📚 Library Management System</div>
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onNavigate(tab.key)}
            style={{
              ...styles.tabButton,
              ...(active === tab.key ? styles.tabActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 28px',
    backgroundColor: '#3d2817',
    color: '#fff',
    flexWrap: 'wrap',
  },
  brand: { fontWeight: 700, fontSize: '1.1rem' },
  tabs: { display: 'flex', gap: '8px' },
  tabButton: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.4)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  tabActive: {
    backgroundColor: '#fff',
    color: '#3d2817',
    fontWeight: 600,
  },
};
