import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
  const { historico, registrarPresenca } = useAppData();
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
      <Text style={styles.email}>{user?.email ?? ''}</Text>

      <View style={styles.statContainer}>
        <Text style={styles.statNumero}>{historico.length}</Text>
        <Text style={styles.statLabel}>
          {historico.length === 1 ? 'presença registrada' : 'presenças registradas'}
        </Text>
      </View>

      <Message type={message.type} message={message.text} />

      <Button
        title="Registrar Presença"
        onPress={handleRegisterAttendance}
        style={styles.botao}
      />

      <TouchableOpacity style={styles.logoutBotao} onPress={logout}>
        <Text style={styles.logoutTexto}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  imagem: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 20,
  },
  statContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  statNumero: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  botao: {
    width: '80%',
    marginTop: 4,
  },
  logoutBotao: {
    marginTop: 28,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  logoutTexto: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
