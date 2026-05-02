import { View, Text, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import Button from '../../components/Button';
import Message from '../../components/Message';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { validateLocation } from '../../utils/locationService';
import { checkWifiConnection } from '../../utils/wifiService';
import { Colors } from '../../constants/colors';

export default function Profile() {
  const { user, logout } = useAuth();
  const { registrarPresenca } = useAppData();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  async function handleRegisterAttendance() {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const locationResult = await validateLocation();
      if (!locationResult.isValid) {
        setMessage({
          type: 'error',
          text: `Você está muito longe da FIAP (${locationResult.distance}m). Aproxime-se da instituição.`,
        });
        return;
      }

      const wifiResult = await checkWifiConnection();
      if (!wifiResult.isValid) {
        setMessage({ type: 'error', text: wifiResult.message });
        return;
      }

      await registrarPresenca({ local: 'FIAP Paulista' });
      setMessage({ type: 'success', text: 'Presença registrada com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Erro ao registrar presença' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} message="Validando..." />

      <Image source={require('../../assets/fiap-logo.png')} style={styles.imagem} />

      <Text style={styles.nome}>{user?.nome ?? 'Usuário'}</Text>
      <Text style={styles.info}>{user?.email ?? ''}</Text>

      <Message type={message.type} message={message.text} />

      <Button title="Registrar Presença" onPress={handleRegisterAttendance} style={styles.botao} />

      <Text style={styles.logout} onPress={logout}>
        Sair
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  imagem: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  botao: {
    marginTop: 12,
    width: '80%',
  },
  logout: {
    color: Colors.primary,
    marginTop: 25,
    fontSize: 16,
  },
});
