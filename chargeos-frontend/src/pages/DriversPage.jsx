import React from 'react';
import { C } from '../theme';
import { Badge, TableHead, EmptyState } from '../components/UI';

export default function DriversPage({ drivers }) {
  const cols = [
    { label: 'Driver', w: '1.6fr' }, { label: 'Email', w: '1.8fr' },
    { label: 'Phone', w: '1fr' }, { label: 'Sessions', w: '0.7fr' },
    { label: 'kWh', w: '0.7fr' }, { label: 'Total Spend', w: '0.9fr' },
    { label: 'Status', w: '0.7fr' }, { label: 'Joined', w: '0.9fr' },
  ];

  return (
    <div>
      <div style={{
        background: C.white, borderRadius: 12, border: `1px solid ${C.grayBorder}`,
        overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <TableHead cols={cols} />
        {!drivers?.length
          ? <EmptyState message="No drivers registered yet" />
          : drivers.map((d, i) => (
            <div key={d.id} style={{
              display: 'grid', gridTemplateColumns: cols.map(c => c.w || '1fr').join(' '),
              gap: 12, padding: '13px 18px', alignItems: 'center',
              borderBottom: i < drivers.length - 1 ? `1px solid ${C.grayBorder}` : 'none',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{d.name || '—'}</div>
                <div style={{ fontSize: 10, fontFamily: 'DM Mono', color: C.textLight, marginTop: 1 }}>DRV-{d.id}</div>
              </div>
              <span style={{ fontSize: 12, color: C.textMid }}>{d.email || '—'}</span>
              <span style={{ fontSize: 12, color: C.textMid }}>{d.phone || '—'}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{parseInt(d.session_count) || 0}</span>
              <span style={{ fontSize: 13, color: C.textMid }}>{parseFloat(d.total_kwh || 0).toFixed(1)}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>
                ${((parseInt(d.total_spent_cents) || 0) / 100).toFixed(2)}
              </span>
              <Badge status={d.status || 'Active'} small />
              <span style={{ fontSize: 11, color: C.textLight }}>
                {d.created_at ? new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
              </span>
            </div>
          ))
        }
      </div>
    </div>
  );
}
