import React, { useState } from 'react';
import { C } from '../theme';
import { Badge, TableHead, EmptyState } from '../components/UI';
import { stopSession, refundSession } from '../services/api';

export default function SessionsPage({ sessions, toast, refresh }) {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? sessions : sessions.filter(s => s.status === filter);

  const cols = [
    { label: 'ID', w: '0.5fr' }, { label: 'Driver', w: '1.1fr' }, { label: 'Charger', w: '1fr' },
    { label: 'Site', w: '1fr' }, { label: 'Started', w: '1fr' }, { label: 'Duration', w: '0.6fr' },
    { label: 'Energy', w: '0.6fr' }, { label: 'Amount', w: '0.6fr' }, { label: 'Status', w: '0.65fr' },
    { label: 'Payment', w: '0.65fr' }, { label: '', w: '0.55fr' },
  ];

  const handleStop = async (session) => {
    try {
      await stopSession(session.id);
      toast(`Stop command sent for session ${session.id}`);
      setTimeout(refresh, 2000);
    } catch (err) { toast(err.message, 'error'); }
  };

  const handleRefund = async (session) => {
    if (!confirm(`Refund $${((session.amount_cents || 0) / 100).toFixed(2)} for session ${session.id}?`)) return;
    try {
      await refundSession(session.id);
      toast(`Refund processed for session ${session.id}`);
      refresh();
    } catch (err) { toast(err.message, 'error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {['All', 'Active', 'Completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            background: filter === f ? C.blue : 'transparent',
            color: filter === f ? '#fff' : C.textMid,
            border: filter === f ? `1px solid ${C.blue}` : `1px solid ${C.grayBorder}`,
          }}>
            {f} <span style={{
              marginLeft: 4, borderRadius: 10, padding: '0 6px', fontSize: 10,
              background: filter === f ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
              color: filter === f ? '#fff' : C.textMid,
            }}>
              {sessions.filter(s => f === 'All' || s.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.grayBorder}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <TableHead cols={cols} />
        {filtered.length === 0
          ? <EmptyState message="No sessions found" />
          : filtered.map((s, i) => {
            const mins = s.duration_minutes || (s.started_at ? Math.round((Date.now() - new Date(s.started_at).getTime()) / 60000) : 0);
            const dur = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
            return (
              <div key={s.id} style={{
                display: 'grid', gridTemplateColumns: cols.map(c => c.w || '1fr').join(' '),
                gap: 12, padding: '13px 18px', alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? `1px solid ${C.grayBorder}` : 'none',
              }}>
                <span style={{ fontSize: 12, fontFamily: 'DM Mono', color: C.blue, fontWeight: 500 }}>{s.id}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{s.driver_name || '—'}</span>
                <span style={{ fontSize: 12, color: C.textMid }}>{s.charger_name || s.charger_id}</span>
                <span style={{ fontSize: 12, color: C.textMid }}>{s.site_name || '—'}</span>
                <span style={{ fontSize: 12, color: C.textMid }}>
                  {s.started_at ? new Date(s.started_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}
                </span>
                <span style={{ fontSize: 12, color: C.textMid }}>{dur}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  {s.kwh_used ? `${parseFloat(s.kwh_used).toFixed(1)} kWh` : '—'}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>
                  {s.amount_cents ? `$${(s.amount_cents / 100).toFixed(2)}` : '—'}
                </span>
                <Badge status={s.status} small />
                <Badge status={s.payment_status || 'Pending'} small />
                {s.status === 'Active'
                  ? <button onClick={() => handleStop(s)} style={{
                    fontSize: 11, padding: '5px 10px', borderRadius: 6,
                    background: C.redLight, border: '1px solid #FCA5A5',
                    color: C.red, cursor: 'pointer', fontWeight: 500,
                  }}>Stop</button>
                  : s.payment_status === 'Paid'
                    ? <button onClick={() => handleRefund(s)} style={{
                      fontSize: 11, padding: '5px 10px', borderRadius: 6,
                      background: C.amberLight, border: `1px solid ${C.amberMid}`,
                      color: C.amber, cursor: 'pointer', fontWeight: 500,
                    }}>Refund</button>
                    : <span style={{ fontSize: 11, color: C.textLight }}>—</span>
                }
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
