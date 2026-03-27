import React from 'react';
import { C } from '../theme';
import { Badge, EmptyState } from '../components/UI';

export default function SitesPage({ sites }) {
  if (!sites?.length) return <EmptyState message="No sites configured yet" />;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
      {sites.map(site => (
        <div key={site.id} style={{
          background: C.white, borderRadius: 12, border: `1px solid ${C.grayBorder}`,
          padding: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{site.name}</div>
              <div style={{ fontSize: 11, color: C.textLight, marginTop: 3 }}>
                {[site.address, site.city, site.state, site.zip].filter(Boolean).join(', ')}
              </div>
            </div>
            <Badge status={parseInt(site.active_sessions) > 0 ? 'Charging' : 'Available'} small />
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
            paddingTop: 14, borderTop: `1px solid ${C.grayBorder}`,
          }}>
            {[
              { l: 'Ports', v: parseInt(site.port_count) || 0, c: C.blue },
              { l: 'Active', v: parseInt(site.active_sessions) || 0, c: C.green },
              { l: 'Contact', v: site.contact_name || '—', c: C.text },
              { l: 'Revenue', v: `$${Math.round((parseInt(site.total_revenue_cents) || 0) / 100).toLocaleString()}`, c: C.text },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 10, color: C.textLight, marginTop: 3, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
