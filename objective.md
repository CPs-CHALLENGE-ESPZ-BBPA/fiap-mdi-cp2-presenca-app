# Checkpoint 2 — Mobile Development & IoT
**Engenharia de Software - 3º Ano**

---

## Sobre o Checkpoint

O CP2 é a evolução direta do projeto entregue no CP1. O grupo deve pegar o MVP construído anteriormente e transformá-lo em um app mais completo, com autenticação de usuários, persistência de dados local, gerenciamento de estado global e uma experiência visual refinada.

---

## Objetivo

Evoluir o aplicativo desenvolvido no CP1, incorporando:

- Autenticação de usuários (cadastro e login com dados persistidos)
- Persistência de dados local com AsyncStorage
- Gerenciamento de estado global via Context API
- Formulários com validação de campos obrigatórios e formato
- Aprimoramento visual e de UX/UI em todas as telas existentes
- Pelo menos um diferencial técnico não abordado em aula, com justificativa documentada

---

## Requisitos Técnicos

O app deve continuar usando **React Native + Expo** e acumular todos os requisitos do CP1.

### Obrigatórios — herdados do CP1

- Projeto iniciado com Expo CLI e estrutura organizada em pastas (`components`, `screens`, `context`, etc.)
- Uso de `View`, `Text`, `Image` e `TouchableOpacity`
- Componentização — sem arquivos monolíticos
- Estilização com `StyleSheet` — layout consistente e agradável
- Pelo menos 3 telas distintas com navegação via Expo Router
- Navegação funcional entre todas as telas (zero telas mortas ou botões sem ação)

### Obrigatórios — novos para o CP2

#### 1. Autenticação com AsyncStorage

- Tela de **Cadastro** com os campos:
  - Nome completo
  - E-mail (formato válido: `usuario@dominio.com`)
  - Senha (mínimo 6 caracteres)
  - Confirmação de senha (deve ser idêntica à senha)
- Tela de **Login** com os campos:
  - E-mail
  - Senha
- Dados de usuário cadastrado devem ser salvos no AsyncStorage
- Login deve validar as credenciais contra os dados persistidos
- Após login bem-sucedido, redirecionar para a tela principal do app
- Implementar logout com limpeza da sessão e retorno à tela de login
- Sessão persistida: ao reabrir o app, o usuário logado não deve precisar fazer login novamente

#### 2. Persistência de Dados com AsyncStorage

- Dados funcionais do app (reservas, itens, agendamentos, etc.) também devem ser persistidos
- Os dados devem sobreviver ao fechamento e reabertura do app
- Leitura dos dados ao montar as telas (com `useEffect`)
- Atualização dos dados sempre que houver inserção, edição ou exclusão

#### 3. Gerenciamento de Estado Global com Context API

- Criar pelo menos um Context para gerenciar estado compartilhado entre telas (ex: `AuthContext`, `AppDataContext`)
- O `AuthContext` deve disponibilizar: usuário logado, função de login, função de logout
- O acesso a telas autenticadas deve ser protegido — usuário não logado não pode acessar o conteúdo principal
- O estado global deve ser consumido via `useContext` nos componentes que precisarem

#### 4. Formulários com Validação

- Todos os formulários do app devem ter validação explícita dos campos
- Validações obrigatórias mínimas:
  - Campo vazio → mensagem de erro inline (ex: "O e-mail é obrigatório")
  - Formato de e-mail inválido → mensagem de erro inline
  - Senha com menos de 6 caracteres → mensagem de erro inline
  - Senhas divergentes no cadastro → mensagem de erro inline
- Os erros devem aparecer **abaixo do campo correspondente, em vermelho**, sem `alert`/`modal`
- O botão de submissão não deve funcionar enquanto há erros de validação

---

## Diferenciais — pelo menos UM é obrigatório

| # | Diferencial | Descrição |
|---|-------------|-----------|
| 1 | Expo SecureStore | Armazenar o token/sessão de forma segura em vez de AsyncStorage puro |
| 2 | Animações com Animated API | Transições e feedbacks visuais animados (ex: shake no erro de login, fade-in de telas) |
| 3 | Modo Escuro / Tema dinâmico | Suporte a dark mode com alternância pelo usuário, usando Context |
| 4 | Notificações locais com Expo Notifications | Notificações agendadas (ex: lembrete de reserva, prazo de entrega) |
| 5 | Câmera ou galeria com Expo ImagePicker | Upload de foto de perfil ou imagem relacionada ao app |
| 6 | Busca e filtragem em tempo real | FlatList com campo de busca e filtro dinâmico por texto |
| 7 | Outro | Proposta justificada pelo grupo |

O diferencial escolhido deve ser justificado no README com a explicação de por que foi escolhido e o que agrega ao projeto.

---

## Requisitos de UX/UI

Obrigatório em todas as telas:

- Hierarquia visual clara: títulos, subtítulos e corpo de texto com tamanhos e pesos distintos
- Paleta de cores coerente: no mínimo uma cor primária, uma cor de destaque e cores de feedback (verde para sucesso, vermelho para erro)
- Espaçamento consistente: padding e margin uniformes
- Componentes de feedback visual:
  - Loading spinner (`ActivityIndicator`) durante operações assíncronas
  - Mensagem de erro inline nos formulários (não usar `Alert`)
  - Mensagem de sucesso após ação concluída
  - Tela ou componente de "lista vazia" quando não há dados
- Teclado não deve cobrir campos de formulário: usar `KeyboardAvoidingView` ou `ScrollView`

Fortemente recomendado:

- Identidade visual coerente com a FIAP ou com o tema do app
- Ícones consistentes (ex: `@expo/vector-icons`)
- Inputs com placeholder, label visível e ícone indicativo
- Responsividade mínima com `Dimensions` ou Flexbox bem estruturado

---

## Estrutura de Pastas Sugerida

```
meu-app/
├── app/                    # Rotas do Expo Router
│   ├── (auth)/
│   │   ├── login.jsx
│   │   └── cadastro.jsx
│   ├── (tabs)/
│   │   ├── index.jsx
│   │   └── ...
│   └── _layout.jsx
├── components/             # Componentes reutilizáveis
│   ├── Button.jsx
│   ├── Input.jsx
│   └── ...
├── context/                # Contexts globais
│   ├── AuthContext.jsx
│   └── AppDataContext.jsx
├── hooks/                  # Custom hooks (se houver)
├── constants/              # Cores, tamanhos, textos fixos
└── assets/                 # Imagens e fontes
```

---

## Requisitos de Entrega

### 1. Repositório GitHub

- Repositório **público**
- Nome: `fiap-mdi-cp2-[nome-do-app]`
- Todos os membros devem ter commits relevantes
- Mensagens de commit descritivas em português ou inglês
- O projeto deve rodar sem erros com `npx expo start`
- Branch `main` deve sempre conter a versão funcional mais recente

### 2. README.md — Documentação Completa

**a) Sobre o Projeto**
- Nome do app e descrição do problema que resolve
- Qual operação da FIAP foi escolhida e por quê
- O que mudou/melhorou em relação ao CP1
- Lista completa de funcionalidades implementadas

**b) Integrantes do Grupo**
- Nome completo e RM de cada integrante

**c) Como Rodar o Projeto**
- Pré-requisitos (Node, Expo Go, versão do Expo SDK)
- Passo a passo para clonar e executar localmente

**d) Demonstração Visual — OBRIGATÓRIO**
- Prints de **todas** as telas do app (mínimo: uma print por tela)
- GIF ou vídeo demonstrando o fluxo completo: cadastro → login → uso do app → logout
- ⛔ README sem prints e sem demonstração = **-50% na nota de Documentação**

**e) Decisões Técnicas**
- Estrutura de pastas e responsabilidades
- Quais Contexts foram criados e o que cada um gerencia
- Como a autenticação foi implementada
- Como o AsyncStorage foi utilizado (quais dados e com quais chaves)
- Como a navegação protegida foi implementada

**f) Diferencial Implementado — OBRIGATÓRIO**
- Qual diferencial foi escolhido
- Justificativa e o que agrega à experiência do usuário
- Como foi implementado (resumo técnico)

**g) Próximos Passos** (opcional, mas valorizado)

---

## Critérios de Avaliação

| Critério | Descrição | Peso |
|----------|-----------|------|
| Funcionalidade | App roda sem erros; auth, persistência, validação e navegação funcionam | 25% |
| Qualidade Técnica | Uso adequado de Context API, AsyncStorage, hooks, componentes e navegação protegida | 20% |
| Apresentação | Clareza na exposição, demonstração ao vivo e domínio técnico nas respostas | 15% |
| Documentação | README completo com prints, vídeo/GIF e justificativa do diferencial | 15% |
| UX & Design | Interface intuitiva, consistente, com feedback visual e hierarquia visual clara | 15% |
| Colaboração no Git | Todos os membros têm commits relevantes e descritivos | 5% |
| Diferencial | Implementação além do mínimo, justificada e funcional | 5% |

---

## O que NÃO será aceito

- Apps que não inicializam ou travam na abertura
- Repositório privado no momento da avaliação
- README vazio, genérico ou sem demonstração visual
- Autenticação "fake" — login que aceita qualquer entrada sem validar
- AsyncStorage usado apenas para um único dado
- Context API importado mas não utilizado de forma significativa
- Formulários sem validação ou com validação apenas via `Alert`
- Projetos individuais entregues como grupo
- Cópias de tutoriais sem adaptação ao tema proposto
- Grupo sem nenhum diferencial implementado
- Uso de bibliotecas externas de autenticação (Firebase Auth, Supabase, etc.)

---

## Composição dos Grupos

- Grupos de **4 a 5 integrantes** (mesmos grupos do CP1)
- Não serão aceitos grupos fora do tamanho especificado sem autorização prévia
- Grupos com integrantes sem commits relevantes terão desconto proporcional na nota de Colaboração
