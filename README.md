# CodeSpark: Academia de Automação (MVP)

Trilha única focada em **Python para IA** (variáveis → if/else) mais um desafio completo na Arena para automatizar uma linha de sensores usando loops.

## Visão Geral

- **Academia Python**: 5 lições sequenciais (print, variáveis, tipos, operações, if/else) em formato stories com quizzes e arraste-e-solte para treinar sintaxe.
- **Arena – Laboratório de Automação IA**: workspace com teclado inteligente e simulação visual sempre acessível; você pode praticar desde o primeiro minuto, mas completar a trilha Python aumenta muito a eficiência.
- **Progressão**: completar todas as lições libera o checkpoint “Fundamentos Python” e, consequentemente, o desafio avançado. O ranking usa o tempo e eficiência do script submetido.
- **Roadmap**: banners na Academia avisam sobre futuras trilhas (Dados, Visão, NLP) para alinhar com o plano de ensinar IA por camadas.

## Stack

- **Frontend**: React 19 + Vite, React Router, Axios.
- **Backend**: Node.js + Express 5 com dados em memória, simulador simples e ranking mockado.

## Como rodar

### Pré-requisitos
- Node.js 18+

### API (server)
```powershell
cd server
npm install
npm run dev
```
A API sobe em `http://localhost:4000`. Endpoint de teste: `GET /api/health`.

### Web App (client)
```powershell
cd client
npm install
npm run dev
```
Acesse `http://localhost:5173`. Para apontar para outra API, crie `.env` na pasta `client` com:
```
VITE_API_URL=http://localhost:4000/api
```

### Build de produção
```powershell
cd client
npm run build
```
Os artefatos ficam em `client/dist`.

## Funcionalidades principais
- Trilha vertical exclusiva da jornada Python, com ícones diferenciando lições e checkpoints e o banner de “próximas trilhas”.
- Player de lições em formato stories com cartões de conceito/código/quiz/ordenação, barra de progresso e tela de recompensa + XP.
- Arena com o desafio “Laboratório de Automação IA” que mostra contexto, critérios de sucesso, ranking e bloqueio até finalizar toda a trilha.
- Workspace Python-first: teclado inteligente com snippets úteis, starter template com sensores fictícios, simulação 2D que traduz a complexidade do script em trilha visual e métricas (tempo, rotinas, loops detectados, insights de variáveis/condicionais).
- Player de lições agora com corações, streak e XP preview em tempo real — bem no espírito Duolingo — incentivando combos sem depender de GIFs.
- Tela inicial mostra seu streak atual e quantos corações sobraram antes da próxima missão.
- Simulação da Arena virou um mini idle-game: ao rodar o script, você começa a farmar pontos automaticamente (+pts/s) até decidir parar ou mexer no código.

## Próximos passos sugeridos
- Persistir progresso em banco real (ex: Prisma + SQLite/Postgres).
- Autenticação e perfis multiusuário.
- Editor com destaque de sintaxe real (ex: Monaco) e motor de simulação separado.
- Testes automatizados (unitários e e2e) cobrindo lições e desafio.
- Expandir trilhas: Dados para IA, Visão Computacional, NLP, cada uma com suas arenas específicas.
