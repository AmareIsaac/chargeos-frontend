import React, { useState } from 'react';
import { C } from '../theme';
import { saveSettings } from '../services/api';

function Field({ label, value, onChange, readOnly, mono }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: C.textMid, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: `1px solid ${C.grayBorder}`,
          background: readOnly ? '#F8FAFC' : '#fff',
          color: readOnly ? C.textLight : C.text,
          fontSize: 13, fontFamily: mono ? 'DM Mono' : undefined, outline: 'none',
        }}
      />
    </div>
  );
}

function ToggleRow({ label }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: `1px solid ${C.grayBorder}`,
    }}>
      <span style={{ fontSize: 13, color: C.text }}>{label}</span>
      <div style={{
        width: 40, height: 22, borderRadius: 11, background: C.blue,
        position: 'relative', cursor: 'pointer',
      }}>
        <div style={{
          position: 'absolute', right: 2, top: 2, width: 18, height: 18,
          borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  );
}

export default function SettingsPage({ settings, toast, connectedCount }) {
  const [l2, setL2] = useState(settings ? (settings.l2RateCents / 100).toFixed(2) : '0.30');
  const [dc, setDc] = useState(settings ? (settings.dcfcRateCents / 100).toFixed(2) : '0.50');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings(
        Math.round(parseFloat(l2) * 100),
        Math.round(parseFloat(dc) * 100),
      );
      toast('Configuration saved successfully');
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const cards = [
    {
      title: 'Payment · Stripe Connect',
      content: (
        <>
          <Field label="L2 Rate ($ per kWh)" value={l2} onChange={setL2} />
          <Field label="DCFC Rate ($ per kWh)" value={dc} onChange={setDc} />
        </>
      ),
    },
    {
      title: 'OCPP Server',
      content: (
        <>
          <Field label="WebSocket URL" value={settings?.ocppUrl || 'wss://charge.precisebs.com/ocpp'} readOnly mono />
          <Field label="Protocol" value="OCPP 1.6J" readOnly />
          <Field label="Heartbeat Interval" value="30 seconds" readOnly />
          <div style={{
            padding: '10px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            background: connectedCount > 0 ? C.greenLight : C.redLight,
            border: `1px solid ${connectedCount > 0 ? '#86EFAC' : '#FCA5A5'}`,
            color: connectedCount > 0 ? C.green : C.red,
          }}>
            ● {connectedCount} charger{connectedCount !== 1 ? 's' : ''} connected
          </div>
        </>
      ),
    },
    {
      title: 'Auth Methods',
      content: (
        <>
          {['RFID Card / Fob', 'QR Code (Web)', 'Mobile App', 'Plug & Charge (ISO 15118)', 'Admin Override'].map(m => (
            <ToggleRow key={m} label={m} />
          ))}
        </>
      ),
    },
    {
      title: 'Alert Notifications',
      content: (
        <>
          {['Charger Fault', 'Charger Recovery', 'Payment Failure'].map(a => (
            <ToggleRow key={a} label={a} />
          ))}
        </>
      ),
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 900 }}>
      {cards.map(card => (
        <div key={card.title} style={{
          background: C.white, borderRadius: 12, border: `1px solid ${C.grayBorder}`,
          padding: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 18,
            paddingBottom: 14, borderBottom: `1px solid ${C.grayBorder}`,
          }}>
            {card.title}
          </div>
          {card.content}
        </div>
      ))}
      <div style={{ gridColumn: '1 / -1' }}>
        <button onClick={handleSave} disabled={saving} style={{
          padding: '10px 24px', borderRadius: 8, background: C.blue,
          color: '#fff', border: 'none', fontSize: 13, fontWeight: 600,
          cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1,
        }}>
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
}
