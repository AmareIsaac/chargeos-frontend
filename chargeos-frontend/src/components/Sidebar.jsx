import React from 'react';
import { C } from '../theme';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'chargers', label: 'Charge Points', icon: '⚡' },
  { id: 'sessions', label: 'Sessions', icon: '◎' },
  { id: 'sites', label: 'Locations', icon: '◉' },
  { id: 'drivers', label: 'Drivers', icon: '👤' },
  { id: 'settings', label: 'Settings', icon: '⊙' },
];

export { NAV_ITEMS };

export default function Sidebar({ tab, setTab, connectedCount, totalPorts, time, onLogout }) {
  const online = connectedCount > 0;

  return (
    <div style={{
      width: 240, background: C.sidebar,
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: C.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}>⚡</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: 0.3 }}>ChargeOS</div>
            <div style={{ color: C.sidebarText, fontSize: 10, marginTop: 1 }}>by Precise Building</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{
          fontSize: 10, color: '#475569', letterSpacing: 1.5,
          fontWeight: 600, padding: '0 8px', marginBottom: 8,
        }}>
          MAIN MENU
        </div>
        {NAV_ITEMS.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8, marginBottom: 2,
            cursor: 'pointer', textAlign: 'left', border: 'none',
            fontSize: 13, fontWeight: 500,
            background: tab === n.id ? 'rgba(37,99,235,0.15)' : 'transparent',
            color: tab === n.id ? '#60A5FA' : C.sidebarText,
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{n.icon}</span>
            {n.label}
            {tab === n.id && (
              <div style={{
                marginLeft: 'auto', width: 3, height: 16,
                borderRadius: 2, background: C.blue,
              }} />
            )}
          </button>
        ))}
      </nav>

      {/* Live status */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          background: online ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)',
          border: `1px solid ${online ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)'}`,
          borderRadius: 8, padding: '10px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: online ? '#22C55E' : C.red,
              animation: 'pulse 2s infinite',
            }} />
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: online ? '#4ADE80' : '#FCA5A5',
            }}>
              {online ? 'Network Online' : 'No Chargers'}
            </span>
          </div>
          <div style={{ fontSize: 10, color: '#475569' }}>
            {connectedCount}/{totalPorts} chargers connected
          </div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div style={{ padding: '0 20px 16px' }}>
        <button onClick={onLogout} style={{
          width: '100%', padding: 8, borderRadius: 8,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: C.sidebarText, fontSize: 11, cursor: 'pointer', fontWeight: 500,
        }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
