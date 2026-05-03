import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Colors } from '../../constants/colors';

function ListaVazia() {
  return (
    <View style={styles.vazio}>
      <Text style={styles.vazioIcone}>📋</Text>
      <Text style={styles.vazioTitulo}>Nenhuma presença registrada</Text>
      <Text style={styles.vazioSubtitulo}>
        Vá até a aba Perfil e registre sua presença estando na FIAP.
      </Text>
    </View>
  );
}

function ItemPresenca({ item }) {
  const data = new Date(item.data);
  const dataFormatada = data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const horaFormatada = data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.item}>
      <View style={styles.itemIndicador} />
      <View style={styles.itemConteudo}>
        <Text style={styles.itemLocal}>{item.local ?? 'FIAP'}</Text>
        <Text style={styles.itemData}>{dataFormatada} às {horaFormatada}</Text>
      </View>
      <View style={styles.itemBadge}>
        <Text style={styles.itemBadgeTexto}>✓</Text>
      </View>
    </View>
  );
}

export default function Historico() {
  const { historico, loadHistorico } = useAppData();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistorico();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await loadHistorico();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.contador}>
        {historico.length} {historico.length === 1 ? 'presença registrada' : 'presenças registradas'}
      </Text>

      <FlatList
        data={[...historico].reverse()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ItemPresenca item={item} />}
        ListEmptyComponent={<ListaVazia />}
        contentContainerStyle={historico.length === 0 ? styles.listaVazia : styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contador: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lista: {
    padding: 16,
    gap: 10,
  },
  listaVazia: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
  },
  itemIndicador: {
    width: 4,
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 2,
    marginRight: 12,
    minHeight: 40,
  },
  itemConteudo: {
    flex: 1,
  },
  itemLocal: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemData: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  itemBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.successBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBadgeTexto: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: 'bold',
  },
  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  vazioIcone: {
    fontSize: 48,
    marginBottom: 16,
  },
  vazioTitulo: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  vazioSubtitulo: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
