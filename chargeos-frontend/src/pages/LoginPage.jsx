import React, { useState } from 'react';
import { C } from '../theme';
import { login } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    }}>
      <div style={{
        width: 380, background: C.white, borderRadius: 16,
        padding: '40px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: C.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: '#fff',
          }}>⚡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: C.text }}>ChargeOS</div>
            <div style={{ fontSize: 11, color: C.textLight }}>by Precise Building Services</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.textMid, display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
              placeholder="ariel@precisebs.com"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: `1px solid ${C.grayBorder}`, fontSize: 13, outline: 'none',
              }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.textMid, display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: `1px solid ${C.grayBorder}`, fontSize: 13, outline: 'none',
              }} />
          </div>
          {error && (
            <div style={{
              padding: '8px 12px', borderRadius: 8, background: C.redLight,
              color: C.red, fontSize: 12, marginBottom: 16, fontWeight: 500,
            }}>{error}</div>
          )}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 11, borderRadius: 8, background: C.blue,
            color: '#fff', border: 'none', fontSize: 13, fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
