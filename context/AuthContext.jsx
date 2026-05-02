import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const KEYS = {
  USERS: '@presenca:users',
  SESSION: '@presenca:session',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const raw = await AsyncStorage.getItem(KEYS.SESSION);
      if (raw) setUser(JSON.parse(raw));
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  }

  async function register({ nome, email, senha }) {
    const users = await getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('E-mail já cadastrado');
    }
    const updated = [...users, { nome, email, senha }];
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(updated));
  }

  async function login(email, senha) {
    const users = await getUsers();
    const found = users.find(u => u.email === email && u.senha === senha);
    if (!found) throw new Error('E-mail ou senha inválidos');
    const session = { nome: found.nome, email: found.email };
    await AsyncStorage.setItem(KEYS.SESSION, JSON.stringify(session));
    setUser(session);
  }

  async function logout() {
    await AsyncStorage.removeItem(KEYS.SESSION);
    setUser(null);
  }

  async function getUsers() {
    const raw = await AsyncStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
