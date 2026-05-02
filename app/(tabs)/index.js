import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../../constants/colors';

export default function Inicio() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/fiap-logo.png')} style={styles.imagem} />

      <Text style={styles.titulo}>Presença Inteligente</Text>

      <Text style={styles.descricao}>
        Este projeto foi desenvolvido com o objetivo de modernizar o controle de presença
        dos alunos.
      </Text>

      <Text style={styles.descricao}>
        A proposta é permitir que o aluno registre sua presença de forma independente,
        diretamente pelo aplicativo, sem necessidade de chamadas manuais.
      </Text>

      <Text style={styles.descricao}>
        Para garantir a autenticidade, a presença só pode ser marcada quando o aluno
        estiver conectado ao Wi-Fi da FIAP ou dentro da área de localização da instituição.
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
    padding: 24,
  },
  imagem: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  descricao: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
});
