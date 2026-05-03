import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useShake() {
  const anim = useRef(new Animated.Value(0)).current;

  function shake() {
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  return { shakeStyle: { transform: [{ translateX: anim }] }, shake };
}

function useFadeIn() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  return { opacity: anim };
}

export default function Cadastro() {
  const router = useRouter();
  const { register } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const fadeIn = useFadeIn();
  const { shakeStyle, shake } = useShake();

  function validarCampo(campo, valor, senhaAtual) {
    switch (campo) {
      case 'nome':
        if (!valor.trim()) return 'O nome é obrigatório';
        return '';
      case 'email':
        if (!valor.trim()) return 'O e-mail é obrigatório';
        if (!EMAIL_REGEX.test(valor)) return 'Formato de e-mail inválido';
        return '';
      case 'senha':
        if (!valor) return 'A senha é obrigatória';
        if (valor.length < 6) return 'A senha deve ter no mínimo 6 caracteres';
        return '';
      case 'confirmacao':
        if (!valor) return 'Confirme a senha';
        if (valor !== (senhaAtual ?? senha)) return 'As senhas não coincidem';
        return '';
      default:
        return '';
    }
  }

  function handleBlur(campo, valor) {
    setTouched(prev => ({ ...prev, [campo]: true }));
    const erro = validarCampo(campo, valor);
    setErros(prev => ({ ...prev, [campo]: erro }));
  }

  function handleChange(campo, valor, setter) {
    setter(valor);
    if (touched[campo]) {
      const senhaRef = campo === 'confirmacao' ? senha : undefined;
      const erro = validarCampo(campo, valor, senhaRef);
      setErros(prev => ({ ...prev, [campo]: erro }));
    }
    if (campo === 'senha' && touched.confirmacao) {
      const erroConf = validarCampo('confirmacao', confirmacao, valor);
      setErros(prev => ({ ...prev, confirmacao: erroConf }));
    }
  }

  function formularioValido() {
    return (
      !validarCampo('nome', nome) &&
      !validarCampo('email', email) &&
      !validarCampo('senha', senha) &&
      !validarCampo('confirmacao', confirmacao)
    );
  }

  async function handleCadastro() {
    const allTouched = { nome: true, email: true, senha: true, confirmacao: true };
    setTouched(allTouched);
    const novosErros = {
      nome: validarCampo('nome', nome),
      email: validarCampo('email', email),
      senha: validarCampo('senha', senha),
      confirmacao: validarCampo('confirmacao', confirmacao),
    };
    setErros(novosErros);
    if (Object.values(novosErros).some(Boolean)) {
      shake();
      return;
    }

    setErroGeral('');
    setSucesso('');
    setLoading(true);
    try {
      await register({ nome, email, senha });
      setSucesso('Conta criada com sucesso! Faça o login.');
      setTimeout(() => router.back(), 1500);
    } catch (e) {
      setErroGeral(e.message);
      shake();
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.conteudo, fadeIn]}>
          <Text style={styles.titulo}>Criar Conta</Text>

          <Animated.View style={shakeStyle}>
            <View style={styles.campo}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={[styles.input, touched.nome && erros.nome ? styles.inputErro : null]}
                placeholder="Seu nome"
                placeholderTextColor={Colors.textMuted}
                value={nome}
                onChangeText={v => handleChange('nome', v, setNome)}
                onBlur={() => handleBlur('nome', nome)}
              />
              {touched.nome && !!erros.nome && (
                <Text style={styles.erroInline}>{erros.nome}</Text>
              )}
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={[styles.input, touched.email && erros.email ? styles.inputErro : null]}
                placeholder="usuario@dominio.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={v => handleChange('email', v, setEmail)}
                onBlur={() => handleBlur('email', email)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && !!erros.email && (
                <Text style={styles.erroInline}>{erros.email}</Text>
              )}
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={[styles.input, touched.senha && erros.senha ? styles.inputErro : null]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                value={senha}
                onChangeText={v => handleChange('senha', v, setSenha)}
                onBlur={() => handleBlur('senha', senha)}
              />
              {touched.senha && !!erros.senha && (
                <Text style={styles.erroInline}>{erros.senha}</Text>
              )}
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Confirmar senha</Text>
              <TextInput
                style={[styles.input, touched.confirmacao && erros.confirmacao ? styles.inputErro : null]}
                placeholder="Repita a senha"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                value={confirmacao}
                onChangeText={v => handleChange('confirmacao', v, setConfirmacao)}
                onBlur={() => handleBlur('confirmacao', confirmacao)}
              />
              {touched.confirmacao && !!erros.confirmacao && (
                <Text style={styles.erroInline}>{erros.confirmacao}</Text>
              )}
            </View>

            {!!erroGeral && (
              <View style={styles.erroGeralContainer}>
                <Text style={styles.erroGeralText}>{erroGeral}</Text>
              </View>
            )}

            {!!sucesso && (
              <View style={styles.sucessoContainer}>
                <Text style={styles.sucessoText}>{sucesso}</Text>
              </View>
            )}
          </Animated.View>

          <TouchableOpacity
            style={[styles.botao, !formularioValido() && styles.botaoDesabilitado]}
            onPress={handleCadastro}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.textPrimary} />
            ) : (
              <Text style={styles.textoBotao}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>
              Já tenho conta. <Text style={styles.linkDestaque}>Fazer login</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  conteudo: {
    width: '100%',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 28,
    textAlign: 'center',
  },
  campo: {
    marginBottom: 16,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 15,
  },
  inputErro: {
    borderColor: Colors.error,
  },
  erroInline: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  erroGeralContainer: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  erroGeralText: {
    color: Colors.textPrimary,
    fontSize: 14,
    textAlign: 'center',
  },
  sucessoContainer: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.successBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sucessoText: {
    color: Colors.textPrimary,
    fontSize: 14,
    textAlign: 'center',
  },
  botao: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  textoBotao: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },
  linkDestaque: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
