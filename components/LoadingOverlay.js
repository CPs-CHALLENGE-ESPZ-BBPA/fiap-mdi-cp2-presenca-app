import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';

export default function LoadingOverlay({ visible, message = 'Carregando...' }) {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#E83D84" />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    backgroundColor: '#1A1A1A',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E83D84',
  },

  text: {
    color: '#FFFFFF',
    marginTop: 15,
    fontSize: 16,
  },
});
