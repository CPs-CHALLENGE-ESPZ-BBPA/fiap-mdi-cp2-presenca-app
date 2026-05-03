import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Colors } from '../../constants/colors';

function ListaVazia({ busca }) {
  return (
    <View style={styles.vazio}>
      <Text style={styles.vazioIcone}>📋</Text>
      {busca ? (
        <>
          <Text style={styles.vazioTitulo}>Nenhum resultado</Text>
          <Text style={styles.vazioSubtitulo}>
            Nenhuma presença encontrada para "{busca}".
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.vazioTitulo}>Nenhuma presença registrada</Text>
          <Text style={styles.vazioSubtitulo}>
            Vá até a aba Perfil e registre sua presença estando na FIAP.
          </Text>
        </>
      )}
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
  const [busca, setBusca] = useState('');

  useEffect(() => {
    loadHistorico();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await loadHistorico();
    setRefreshing(false);
  }

  const resultados = useMemo(() => {
    const lista = [...historico].reverse();
    if (!busca.trim()) return lista;
    const termo = busca.toLowerCase();
    return lista.filter(item => {
      const local = (item.local ?? '').toLowerCase();
      const data = new Date(item.data).toLocaleDateString('pt-BR');
      return local.includes(termo) || data.includes(termo);
    });
  }, [historico, busca]);

  return (
    <View style={styles.container}>
      <View style={styles.buscaContainer}>
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar por local ou data..."
          placeholderTextColor={Colors.textMuted}
          value={busca}
          onChangeText={setBusca}
          clearButtonMode="while-editing"
        />
      </View>

      <Text style={styles.contador}>
        {resultados.length}{busca ? ` de ${historico.length}` : ''}{' '}
        {historico.length === 1 ? 'presença registrada' : 'presenças registradas'}
      </Text>

      <FlatList
        data={resultados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ItemPresenca item={item} />}
        ListEmptyComponent={<ListaVazia busca={busca} />}
        contentContainerStyle={resultados.length === 0 ? styles.listaVazia : styles.lista}
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
  buscaContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  buscaInput: {
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  contador: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lista: {
    padding: 16,
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
