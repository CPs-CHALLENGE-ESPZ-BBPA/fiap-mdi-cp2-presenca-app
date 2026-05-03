# Presença Inteligente — CP2

Aplicativo móvel para registro de presença de alunos da FIAP, desenvolvido com React Native + Expo.

O app permite que o aluno registre sua própria presença de forma autônoma, validando via geolocalização e Wi-Fi que ele está fisicamente na instituição — eliminando chamadas manuais e fraudes.

---

## Integrantes do Grupo

| Nome | RM |
|------|----|
| Albert Katri | RM556544 |
| Bruno Carneiro Leão | RM555563 |
| Bruno Biletsky | RM554739 |
| Paulo Akira Okama | RM556840 |

---

## Sobre o Projeto

**Operação escolhida:** Controle de presença de alunos.

A FIAP realiza chamada manual em sala de aula. O problema é a dependência do professor, a possibilidade de erro humano e a dificuldade de rastrear histórico. O app resolve isso dando autonomia ao aluno para registrar presença — com validação dupla (localização GPS + rede Wi-Fi) para garantir autenticidade.

### O que mudou em relação ao CP1

| CP1 | CP2 |
|-----|-----|
| Login hardcoded (`rm123456@fiap.com.br` / `admin`) | Autenticação real com cadastro e AsyncStorage |
| Sem persistência de dados | Todos os dados persistidos localmente |
| Estado local por tela | Estado global via Context API |
| Validação via `Alert` | Validação inline com mensagens por campo |
| 3 telas sem navegação protegida | Navegação protegida — rotas autenticadas e públicas separadas |
| Sem histórico de presenças | Histórico com busca e filtragem em tempo real |

### Funcionalidades implementadas

- Cadastro de usuário com validação de todos os campos
- Login com credenciais persistidas no AsyncStorage
- Sessão persistida — usuário logado não precisa fazer login ao reabrir o app
- Logout com limpeza de sessão
- Registro de presença com validação de localização (GPS) e Wi-Fi
- Histórico de presenças por usuário, com busca e filtro em tempo real
- Proteção de rotas — telas autenticadas inacessíveis sem login
- Feedback visual em todas as operações (loading, sucesso, erro)

---

## Como Rodar o Projeto

**Pré-requisitos:**
- Node.js 18+
- Expo Go instalado no celular (iOS ou Android)
- Expo SDK 55

```bash
git clone https://github.com/CPs-CHALLENGE-ESPZ-BBPA/fiap-mdi-cp2-presenca-app
cd fiap-mdi-cp2-presenca-app
npm install
npx expo start
```

Escaneie o QR Code com o Expo Go ou rode em emulador com `a` (Android) / `i` (iOS).

---

## Demonstração Visual

> **Adicionar prints de todas as telas e vídeo/GIF do fluxo completo.**
> Fluxo mínimo a demonstrar: cadastro → login → registrar presença → histórico → logout.

| Tela | Print |
|------|-------|
| Login | *(adicionar print)* |
| Cadastro | *(adicionar print)* |
| Início | *(adicionar print)* |
| Perfil | *(adicionar print)* |
| Histórico | *(adicionar print)* |
| Histórico com busca ativa | *(adicionar print)* |
| Lista vazia | *(adicionar print)* |

**Vídeo demonstração:** *(adicionar link YouTube/Google Drive)*

---

## Decisões Técnicas

### Estrutura de Pastas

```
fiap-mdi-cp2-presenca-app/
├── app/
│   ├── (auth)/          # Rotas públicas (login, cadastro)
│   │   ├── _layout.js
│   │   ├── login.js
│   │   └── cadastro.js
│   ├── (tabs)/          # Rotas autenticadas (tabs)
│   │   ├── _layout.js
│   │   ├── index.js     # Tela Início
│   │   ├── historico.js # Histórico de presenças
│   │   └── profile.js   # Perfil e registro de presença
│   └── _layout.js       # Root layout com providers e navegação protegida
├── components/          # Button, Message, LoadingOverlay
├── constants/           # colors.js — paleta centralizada
├── context/
│   ├── AuthContext.jsx  # Estado de autenticação global
│   └── AppDataContext.jsx # Histórico de presenças global
└── utils/
    ├── locationService.js
    └── wifiService.js
```

### Contexts criados

**`AuthContext`** — gerencia o estado de autenticação:
- `user`: objeto com `nome` e `email` do usuário logado (ou `null`)
- `isLoading`: controla o splash enquanto a sessão é restaurada do AsyncStorage
- `register({ nome, email, senha })`: salva novo usuário na lista persistida
- `login(email, senha)`: valida credenciais e persiste a sessão
- `logout()`: remove a sessão e reseta o estado

**`AppDataContext`** — gerencia o histórico de presenças:
- `historico`: array com os registros do usuário logado
- `registrarPresenca(dados)`: cria um novo registro com `id`, `email`, `data` e `local`
- `loadHistorico()`: recarrega os registros do AsyncStorage filtrando pelo usuário logado

### Como a autenticação foi implementada

Fluxo completo sem bibliotecas externas:

1. **Cadastro:** dados do usuário são validados e salvos em `@presenca:users` (array de usuários)
2. **Login:** credenciais são comparadas com os usuários salvos; em caso de sucesso, o objeto `{ nome, email }` é salvo em `@presenca:session`
3. **Restauração de sessão:** no boot do app, `AuthContext` lê `@presenca:session` e restaura o usuário automaticamente
4. **Logout:** remove `@presenca:session` e reseta `user` para `null`

### Como o AsyncStorage foi utilizado

| Chave | Conteúdo |
|-------|----------|
| `@presenca:users` | Array com todos os usuários cadastrados `[{ nome, email, senha }]` |
| `@presenca:session` | Objeto do usuário logado `{ nome, email }` |
| `@presenca:historico` | Array com todos os registros de presença de todos os usuários |

### Como a navegação protegida foi implementada

O `app/_layout.js` (root layout) usa `useSegments` e `useRouter` do Expo Router para observar a rota atual e o estado de autenticação:

- Se `user === null` e a rota não está no grupo `(auth)` → redireciona para `/(auth)/login`
- Se `user !== null` e a rota está no grupo `(auth)` → redireciona para `/(tabs)`

O redirecionamento só ocorre após `isLoading === false`, evitando flashes de tela durante a restauração de sessão.

---

## Diferenciais Implementados

### Diferencial #6 — Busca e filtragem em tempo real

**Justificativa:** o histórico de presenças cresce ao longo do semestre. Sem busca, o aluno precisaria rolar a lista inteira para encontrar um registro. A filtragem em tempo real melhora a usabilidade e demonstra domínio de `FlatList` com dados dinâmicos.

**Como foi implementado** (`historico.js`):
- `TextInput` no topo da lista recebe o termo de busca
- `useMemo` recomputa a lista filtrada sempre que `historico` ou `busca` mudam, sem re-renders desnecessários
- Filtra por `local` e por data formatada (`dd/mm/aaaa`)
- Contador exibe `X de Y` durante busca ativa
- Estado vazio com mensagem diferenciada quando a busca não retorna resultado

---

### Diferencial #2 — Animações com Animated API

**Justificativa:** feedback visual imediato melhora a percepção de qualidade do app. O shake no erro de login é um padrão amplamente reconhecido em apps mobile (iOS, Android nativos) que comunica rejeição de forma intuitiva, sem necessidade de texto adicional.

**Como foi implementado** (`login.js` e `cadastro.js`):
- **Fade-in de tela:** ao montar a tela, o conteúdo aparece com `opacity` animada de 0 → 1 em 350ms via `Animated.timing`
- **Shake no erro:** ao tentar submeter com campos inválidos ou credenciais erradas, o formulário executa uma sequência de `translateX` (10 → -10 → 8 → -8 → 0) em 300ms via `Animated.sequence`
- Ambas as animações usam `useNativeDriver: true` para rodar na thread nativa, sem impactar a performance do JS

---

## Próximos Passos

- Integração com API backend para sincronizar presenças entre dispositivos
- Notificações locais lembrando o aluno de registrar presença no início da aula
- Foto de perfil com Expo ImagePicker
- Exportação do histórico em PDF ou CSV
