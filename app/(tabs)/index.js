import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';

const FEATURES = [
  {
    icone: '📍',
    titulo: 'Validação por Localização',
    descricao: 'Presença só é registrada dentro do raio da FIAP.',
  },
  {
    icone: '📶',
    titulo: 'Validação por Wi-Fi',
    descricao: 'Confirmação pela rede Wi-Fi da instituição.',
  },
  {
    icone: '💾',
    titulo: 'Histórico Persistido',
    descricao: 'Seus registros ficam salvos mesmo ao fechar o app.',
  },
];

function CardFeature({ icone, titulo, descricao }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardIcone}>{icone}</Text>
      <View style={styles.cardTexto}>
        <Text style={styles.cardTitulo}>{titulo}</Text>
        <Text style={styles.cardDescricao}>{descricao}</Text>
      </View>
    </View>
  );
}

export default function Inicio() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/fiap-logo.png')} style={styles.imagem} />

      <Text style={styles.titulo}>Presença Inteligente</Text>
      <Text style={styles.subtitulo}>Controle de presença moderno para alunos FIAP</Text>

      <View style={styles.divisor} />

      <Text style={styles.secaoTitulo}>Como funciona</Text>

      {FEATURES.map(f => (
        <CardFeature key={f.titulo} {...f} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 24,
    paddingBottom: 40,
  },
  imagem: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    marginTop: 12,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  divisor: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 24,
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    width: '100%',
  },
  cardIcone: {
    fontSize: 28,
    marginRight: 14,
  },
  cardTexto: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardDescricao: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
