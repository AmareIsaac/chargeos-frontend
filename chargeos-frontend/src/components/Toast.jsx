import React from 'react';
import { C } from '../theme';

export default function Toast({ toast }) {
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 200,
      padding: '12px 18px', borderRadius: 10,
      background: ok ? '#DCFCE7' : '#FEE2E2',
      border: `1px solid ${ok ? '#86EFAC' : '#FCA5A5'}`,
      color: ok ? C.green : C.red,
      fontSize: 13, fontWeight: 500,
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      animation: 'fadeUp 0.3s ease',
    }}>
      {ok ? '✓' : '✕'} {toast.msg}
    </div>
  );
}
