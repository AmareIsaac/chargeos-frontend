import React from 'react';
import { C } from '../theme';
import { NAV_ITEMS } from './Sidebar';

export default function TopBar({ tab, time, user }) {
  return (
    <div style={{
      background: C.white,
      borderBottom: `1px solid ${C.grayBorder}`,
      padding: '0 28px', height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 90,
    }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>
          {NAV_ITEMS.find(n => n.id === tab)?.label}
        </div>
        <div style={{ fontSize: 11, color: C.textLight, marginTop: 1 }}>
          {time.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
          })}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', background: C.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 13,
        }}>
          {(user?.name || 'A')[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
            {user?.name || 'Admin'}
          </div>
          <div style={{ fontSize: 10, color: C.textLight }}>
            {user?.role || 'Administrator'}
          </div>
        </div>
      </div>
    </div>
  );
}
