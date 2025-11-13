# CodeSpark Client (React + Vite)

Frontend responsável pela experiência "Academia → Arena" do CodeSpark. Ele consome os endpoints Express expostos em `/academy` e `/arena`, mantém o progresso no contexto global e entrega a tal "magia do Duolingo" dentro das lições.

## Principais telas

- **Academia**: path vertical com cards de skill, status e XP de cada lição/checkpoint.
- **Lição/story player**: cartões de conceito/código/quiz/arraste com corações, streak, combo e XP preview dinâmico.
- **Lição/story player**: cartões de conceito/código/quiz/arraste com corações, streak, combo e XP preview dinâmico.
- **Arena**: workspace com teclado inteligente, simulação que vira um mini idle game (farm de pontos por segundo) e ranking.

## Scripts úteis

```powershell
# instalar dependências
npm install

# rodar em modo desenvolvimento
npm run dev

# análise estática
npm run lint

# build de produção
npm run build
```

> Configure a API via `VITE_API_URL` (padrão `http://localhost:4000/api`).

## Stack

- React 19 + React Router 7
- Axios para chamadas HTTP
- Vite 7 para build/dev server
- ESLint 9 com regras recomendadas + React Hooks

## Estrutura rápida

- `src/pages`: Academy, Arena, Lesson e Challenge.
- `src/components`: navegação inferior, learning path, teclado, simulação.
- `src/context/AppDataContext.jsx`: fetch + cache de progresso/arena e toasts.
- `src/api/client.js`: cliente Axios apontando para `VITE_API_URL`.

## Experiência gamificada

- Corações limitados: cada erro remove um, combos recuperam motivação.
- Streak cresce a cada trio perfeito de respostas, exibido junto aos corações.
- XP preview mostra quanto da recompensa será conquistada antes de concluir.
- Mensagens de motivação e pill de combo entram após cada resposta correta/errada.
- Simulação da Arena inicia um farm automatizado que continua acumulando pontos mesmo fora da aba, parando apenas quando você muda o código ou aperta “Parar”.

Sinta-se livre para ajustar o tema em `src/App.css` e adicionar novos tipos de cartão caso queira evoluir a mecânica.
