import React, { useState } from 'react';
import { C } from '../theme';
import { Badge, TableHead, EmptyState } from '../components/UI';
import { resetCharger, getChargerQR } from '../services/api';

export default function ChargersPage({ chargers, toast, refresh }) {
  const [filter, setFilter] = useState('All');
  const [busy, setBusy] = useState(null);

  const filtered = filter === 'All'
    ? chargers
    : chargers.filter(c => filter === 'Offline' ? (!c.is_connected && c.status !== 'Faulted') : c.status === filter);

  const cols = [
    { label: 'Charge Point', w: '2fr' }, { label: 'Location', w: '1.5fr' },
    { label: 'Type', w: '0.6fr' }, { label: 'Status', w: '0.9fr' },
    { label: 'Sessions', w: '0.7fr' }, { label: 'Uptime', w: '0.7fr' },
    { label: 'Revenue', w: '0.8fr' }, { label: 'Actions', w: '0.8fr' },
  ];

  const handleReset = async (id) => {
    setBusy(id);
    try {
      await resetCharger(id);
      toast(`Reset sent to ${id}`);
      setTimeout(refresh, 2000);
    } catch (err) { toast(err.message, 'error'); }
    finally { setBusy(null); }
  };

  const handleQR = async (id) => {
    try {
      const data = await getChargerQR(id);
      window.open(data.url, '_blank');
      toast(`QR generated for ${id}`);
    } catch (err) { toast(err.message, 'error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['All', 'Available', 'Charging', 'Faulted', 'Offline'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: filter === f ? C.blue : 'transparent',
              color: filter === f ? '#fff' : C.textMid,
              border: filter === f ? `1px solid ${C.blue}` : `1px solid ${C.grayBorder}`,
              transition: 'all 0.15s',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.grayBorder}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <TableHead cols={cols} />
        {filtered.length === 0
          ? <EmptyState message={`No ${filter.toLowerCase()} chargers`} />
          : filtered.map((c, i) => (
            <div key={c.id} style={{
              display: 'grid', gridTemplateColumns: cols.map(x => x.w || '1fr').join(' '),
              gap: 12, padding: '14px 18px', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? `1px solid ${C.grayBorder}` : 'none',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.name || c.id}</div>
                <div style={{ fontSize: 11, color: C.textLight, marginTop: 2, fontFamily: 'DM Mono' }}>{c.id}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: C.textMid }}>{c.site_name || '—'}</div>
                <div style={{ fontSize: 11, color: C.textLight, marginTop: 1 }}>{c.connector_type || 'J1772'}</div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                background: c.type === 'DCFC' ? C.blueMid : C.greenMid,
                color: c.type === 'DCFC' ? C.blue : C.green,
              }}>
                {c.type || 'L2'}
              </span>
              <Badge status={c.is_connected ? c.status : 'Offline'} small />
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{parseInt(c.total_sessions) || 0}</div>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: (parseFloat(c.uptime_pct) || 0) > 95 ? C.green : (parseFloat(c.uptime_pct) || 0) > 80 ? C.amber : C.red,
              }}>
                {parseFloat(c.uptime_pct || 0).toFixed(0)}%
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                ${Math.round((parseInt(c.total_revenue_cents) || 0) / 100).toLocaleString()}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(c.status === 'Faulted' || !c.is_connected)
                  ? <button onClick={() => handleReset(c.id)} disabled={busy === c.id} style={{
                    fontSize: 11, padding: '5px 10px', borderRadius: 6,
                    background: C.redLight, border: '1px solid #FCA5A5',
                    color: C.red, cursor: 'pointer', fontWeight: 500,
                    opacity: busy === c.id ? 0.5 : 1,
                  }}>
                    {busy === c.id ? '...' : 'Reset'}
                  </button>
                  : <button onClick={() => handleQR(c.id)} style={{
                    fontSize: 11, padding: '5px 10px', borderRadius: 6,
                    background: C.blueLight, border: `1px solid ${C.blueMid}`,
                    color: C.blue, cursor: 'pointer', fontWeight: 500,
                  }}>QR Code</button>
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
