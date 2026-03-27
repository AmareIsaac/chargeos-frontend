import React, { useEffect, useRef } from 'react';
import { C } from '../theme';
import { StatCard, Badge, EmptyState } from '../components/UI';

export default function DashboardPage({ stats, activeSessions, revenueByDay, chargers }) {
  const canvasRef = useRef(null);
  const s = stats || {};
  const mtdRevenue = Math.round((parseInt(s.mtd_revenue_cents) || 0) / 100);
  const mtdKwh = parseFloat(s.mtd_kwh) || 0;
  const todaySessions = parseInt(s.today_sessions) || 0;
  const activeCount = parseInt(s.active_sessions) || 0;

  // Draw revenue chart
  useEffect(() => {
    if (!revenueByDay?.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const data = revenueByDay;
    const max = Math.max(1, ...data.map(d => (parseInt(d.l2_cents) || 0) + (parseInt(d.dcfc_cents) || 0)));
    const bw = W / Math.max(data.length, 1);

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = 20 + (H - 40) * (1 - i / 4);
      ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W, y); ctx.stroke();
      ctx.fillStyle = '#94A3B8'; ctx.font = '10px DM Sans'; ctx.textAlign = 'right';
      ctx.fillText(`$${Math.round(max * i / 4 / 100)}`, 36, y + 4);
    }

    data.forEach((d, i) => {
      const l2 = parseInt(d.l2_cents) || 0;
      const dcfc = parseInt(d.dcfc_cents) || 0;
      const total = l2 + dcfc;
      const totalH = (total / max) * (H - 40);
      const dcfcH = (dcfc / max) * (H - 40);
      const l2H = (l2 / max) * (H - 40);
      const x = i * bw + bw * 0.18 + 36, w = bw * 0.64;

      if (dcfcH > 0) {
        const g1 = ctx.createLinearGradient(0, H - 20 - totalH, 0, H - 20 - l2H);
        g1.addColorStop(0, '#2563EB'); g1.addColorStop(1, '#3B82F6');
        ctx.fillStyle = g1;
        ctx.beginPath(); ctx.roundRect(x, H - 20 - totalH, w, dcfcH, [3, 3, 0, 0]); ctx.fill();
      }
      if (l2H > 0) {
        const g2 = ctx.createLinearGradient(0, H - 20 - l2H, 0, H - 20);
        g2.addColorStop(0, '#16A34A'); g2.addColorStop(1, '#22C55E');
        ctx.fillStyle = g2;
        ctx.beginPath(); ctx.roundRect(x, H - 20 - l2H, w, l2H, [0, 0, 0, 0]); ctx.fill();
      }

      ctx.fillStyle = '#64748B'; ctx.font = '11px DM Sans'; ctx.textAlign = 'center';
      const label = d.date ? new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }) : '';
      ctx.fillText(label, x + w / 2, H - 4);
    });
  }, [revenueByDay]);

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Charge Points" value={parseInt(s.total_ports) || 0} sub={`${parseInt(s.available) || 0} available`} color={C.blue} icon="⚡" delay={0} />
        <StatCard label="Active Sessions" value={activeCount} sub="Live right now" color={C.green} icon="◎" delay={0.05} />
        <StatCard label="Revenue (MTD)" value={`$${mtdRevenue.toLocaleString()}`} sub={`$${Math.round((parseInt(s.today_revenue_cents) || 0) / 100)} today`} color={C.amber} icon="$" delay={0.1} />
        <StatCard label="Energy Delivered (MTD)" value={`${Math.round(mtdKwh).toLocaleString()} kWh`} sub={`${todaySessions} sessions today`} color="#7C3AED" icon="⬡" delay={0.15} />
      </div>

      {/* Chart + port status */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.grayBorder}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Revenue Overview</div>
              <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>Last 7 days · L2 vs DCFC</div>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 11, color: C.textMid }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: C.blue, display: 'inline-block' }} /> DCFC
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: C.green, display: 'inline-block' }} /> L2
              </span>
            </div>
          </div>
          {revenueByDay?.length > 0
            ? <canvas ref={canvasRef} width={560} height={180} style={{ width: '100%', height: 180 }} />
            : <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textLight, fontSize: 13 }}>No revenue data yet</div>
          }
        </div>

        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.grayBorder}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 16 }}>Port Status</div>
          {Object.entries({ Available: C.green, Charging: C.blue, Faulted: C.red, Offline: '#94A3B8' }).map(([status, color]) => {
            const count = status === 'Offline'
              ? chargers.filter(c => !c.is_connected && c.status !== 'Faulted').length
              : chargers.filter(c => c.status === status).length;
            const total = chargers.length || 1;
            return (
              <div key={status} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: C.textMid, fontWeight: 500 }}>{status}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
                    {count} <span style={{ color: C.textLight, fontWeight: 400 }}>/ {chargers.length}</span>
                  </span>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${(count / total) * 100}%`, background: color, borderRadius: 3, transition: 'width 1s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active sessions */}
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.grayBorder}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Active Sessions</div>
          <span style={{ fontSize: 11, background: C.blueLight, color: C.blue, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
            {activeSessions?.length || 0} live
          </span>
        </div>
        {!activeSessions?.length
          ? <EmptyState message="No active sessions right now" />
          : <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(activeSessions.length, 3)}, 1fr)`, gap: 12 }}>
            {activeSessions.map(sess => {
              const mins = sess.started_at ? Math.round((Date.now() - new Date(sess.started_at).getTime()) / 60000) : 0;
              const dur = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
              return (
                <div key={sess.id} style={{ background: C.grayLight, borderRadius: 10, padding: 16, border: `1px solid ${C.grayBorder}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontFamily: 'DM Mono', color: C.blue, fontWeight: 500 }}>TXN-{sess.id}</span>
                    <Badge status="Active" small />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>{sess.driver_name || 'Unknown Driver'}</div>
                  <div style={{ fontSize: 11, color: C.textLight, marginBottom: 12 }}>{sess.charger_name || sess.charger_id} · {dur}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${C.grayBorder}` }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{sess.charger_id}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.textMid }}>Connector {sess.connector_id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
}
