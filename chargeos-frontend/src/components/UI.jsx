import React from 'react';
import { C, STATUS } from '../theme';

export function Badge({ status, small }) {
  const s = STATUS[status] || STATUS.Offline;
  const isAnimated = status === 'Charging' || status === 'Active';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: small ? '2px 8px' : '4px 10px',
      borderRadius: 20, background: s.bg, color: s.text,
      fontSize: small ? 11 : 12, fontWeight: 500, whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0,
        boxShadow: isAnimated ? `0 0 0 2px ${s.dot}30` : 'none',
        animation: isAnimated ? 'pulse 2s infinite' : 'none',
      }} />
      {s.label}
    </span>
  );
}

export function Spinner({ size = 16 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid ${C.grayBorder}`, borderTopColor: C.blue,
      borderRadius: '50%', animation: 'spin 0.6s linear infinite',
      display: 'inline-block',
    }} />
  );
}

export function EmptyState({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px', color: C.textLight }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>○</div>
      <div style={{ fontSize: 13 }}>{message}</div>
    </div>
  );
}

export function TableHead({ cols }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: cols.map(c => c.w || '1fr').join(' '),
      gap: 12, padding: '10px 18px',
      background: '#F8FAFC', borderBottom: `1px solid ${C.grayBorder}`,
    }}>
      {cols.map(c => (
        <div key={c.label} style={{
          fontSize: 11, fontWeight: 600, color: C.textLight, letterSpacing: 0.5,
        }}>
          {c.label.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

export function StatCard({ label, value, sub, color, icon, delay = 0 }) {
  return (
    <div style={{
      background: C.white, borderRadius: 12, padding: '20px 22px',
      border: `1px solid ${C.grayBorder}`,
      animation: `fadeUp 0.4s ease ${delay}s both`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: C.textLight, fontWeight: 500, marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: C.green, marginTop: 4, fontWeight: 500 }}>{sub}</div>}
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 80, gap: 10, color: C.textLight,
    }}>
      <Spinner size={20} />
      <span style={{ fontSize: 13 }}>Loading...</span>
    </div>
  );
}
