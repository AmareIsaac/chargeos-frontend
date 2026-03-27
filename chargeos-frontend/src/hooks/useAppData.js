import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export function useAppData(authed) {
  const [dashData, setDashData] = useState(null);
  const [chargers, setChargers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sites, setSites] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!api.getToken()) return;
    try {
      const [dash, chg, sess, st, drv, cfg] = await Promise.all([
        api.fetchDashboard(),
        api.fetchChargers(),
        api.fetchSessions(),
        api.fetchSites(),
        api.fetchDrivers(),
        api.fetchSettings(),
      ]);
      setDashData(dash);
      setChargers(chg);
      setSessions(sess);
      setSites(st);
      setDrivers(drv);
      setSettings(cfg);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchAll();
    const iv = setInterval(fetchAll, 15000);
    return () => clearInterval(iv);
  }, [authed, fetchAll]);

  return {
    dashData,
    chargers,
    sessions,
    sites,
    drivers,
    settings,
    loading,
    refresh: fetchAll,
  };
}
