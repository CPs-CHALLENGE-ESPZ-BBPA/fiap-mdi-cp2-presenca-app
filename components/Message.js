import { View, Text, StyleSheet } from 'react-native';

export default function Message({ type = 'info', message }) {
  if (!message) return null;

  return (
    <View style={[styles.container, styles[type]]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },

  success: {
    backgroundColor: '#1A4D2E',
    borderWidth: 1,
    borderColor: '#4E9F3D',
  },

  error: {
    backgroundColor: '#4D1A1A',
    borderWidth: 1,
    borderColor: '#E83D84',
  },

  info: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E83D84',
  },

  text: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
  },
});
