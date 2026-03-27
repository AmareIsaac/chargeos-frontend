import React, { useState, useEffect } from 'react';
import { C } from './theme';
import { getToken, getStoredUser, logout } from './services/api';
import { useAppData } from './hooks/useAppData';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChargersPage from './pages/ChargersPage';
import SessionsPage from './pages/SessionsPage';
import SitesPage from './pages/SitesPage';
import DriversPage from './pages/DriversPage';
import SettingsPage from './pages/SettingsPage';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Toast from './components/Toast';
import { LoadingScreen } from './components/UI';

export default function App() {
  const [user, setUser] = useState(getStoredUser());
  const [authed, setAuthed] = useState(!!getToken());
  const [tab, setTab] = useState('dashboard');
  const [time, setTime] = useState(new Date());
  const [toast, setToast] = useState(null);

  const { dashData, chargers, sessions, sites, drivers, settings, loading, refresh } = useAppData(authed);

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthed(true);
  };

  const handleLogout = () => {
    logout();
    setAuthed(false);
    setUser(null);
  };

  if (!authed) return <LoginPage onLogin={handleLogin} />;

  const stats = dashData?.stats || {};
  const connectedCount = dashData?.connectedChargers?.length || 0;
  const totalPorts = parseInt(stats.total_ports) || 0;

  const renderTab = () => {
    if (loading) return <LoadingScreen />;
    switch (tab) {
      case 'dashboard':
        return <DashboardPage stats={stats} activeSessions={dashData?.activeSessions || []} revenueByDay={dashData?.revenueByDay || []} chargers={chargers} />;
      case 'chargers':
        return <ChargersPage chargers={chargers} toast={showToast} refresh={refresh} />;
      case 'sessions':
        return <SessionsPage sessions={sessions} toast={showToast} refresh={refresh} />;
      case 'sites':
        return <SitesPage sites={sites} />;
      case 'drivers':
        return <DriversPage drivers={drivers} />;
      case 'settings':
        return <SettingsPage settings={settings} toast={showToast} connectedCount={connectedCount} />;
      default:
        return <DashboardPage stats={stats} activeSessions={[]} revenueByDay={[]} chargers={chargers} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.grayLight }}>
      <Sidebar
        tab={tab}
        setTab={setTab}
        connectedCount={connectedCount}
        totalPorts={totalPorts}
        time={time}
        onLogout={handleLogout}
      />
      <div style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <TopBar tab={tab} time={time} user={user} />
        <Toast toast={toast} />
        <div style={{ padding: '24px 28px' }}>
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
