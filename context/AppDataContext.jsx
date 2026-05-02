import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const AppDataContext = createContext(null);

const KEY = '@presenca:historico';

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    if (user) loadHistorico();
    else setHistorico([]);
  }, [user]);

  async function loadHistorico() {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      const all = raw ? JSON.parse(raw) : [];
      setHistorico(all.filter(r => r.email === user.email));
    } catch (_) {}
  }

  async function registrarPresenca(dados) {
    const raw = await AsyncStorage.getItem(KEY);
    const all = raw ? JSON.parse(raw) : [];
    const novo = {
      id: Date.now().toString(),
      email: user.email,
      data: new Date().toISOString(),
      ...dados,
    };
    await AsyncStorage.setItem(KEY, JSON.stringify([...all, novo]));
    setHistorico(prev => [...prev, novo]);
    return novo;
  }

  return (
    <AppDataContext.Provider value={{ historico, registrarPresenca, loadHistorico }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData deve ser usado dentro de AppDataProvider');
  return ctx;
}
