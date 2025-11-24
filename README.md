# BotoCode Academy

Experiência gamificada focada em fundamentos de programação com três temas visuais (cyber, retro-game e sport). O frontend React reproduz o fluxo do aplicativo Botocode: painel com HUD dinâmico, trilha de lições, arenas, missões diárias e personalização do avatar Boto. O backend Express original continua disponível caso você queira evoluir para dados persistidos.

## Estrutura

| Pasta | Descrição |
| --- | --- |
| `client/` | Nova aplicação React + Vite em TypeScript (Botocode Academy). Usa Tailwind via CDN, framer-motion, ícones lucide e dados mockados em `services/mockData.ts`. |
| `server/` | API Node.js + Express (ainda baseada no MVP anterior). Pode ser ligada futuramente ao novo frontend ao trocar o contexto mockado. |
| `RELATORIO.md` | Notas suplementares do projeto. |

## Pré-requisitos

- Node.js 18+
- npm 10+

## Como rodar o frontend (client)

```powershell
cd client
npm install
npm run dev
```

A aplicação abre em `http://localhost:3000` usando `HashRouter`, então os links funcionam mesmo em ambientes estáticos. O arquivo `.env.local` permite armazenar a chave `GEMINI_API_KEY` (opcional) e o endpoint `VITE_API_URL` para apontar o frontend ao backend Express (`http://localhost:4000/api` por padrão).

### Build de produção

```powershell
cd client
npm run build
```

Gera assets otimizados em `client/dist`, prontos para deploy estático.

## API Express (opcional)

O backend do MVP original permanece em `server/`. Ele ainda serve dados em memória e pode ser ligado mais tarde ao novo frontend substituindo os mocks.

```powershell
cd server
npm install
npm run dev
```

A API inicia em `http://localhost:4000`.

## Funcionalidades do Botocode frontend

- HUD responsivo (`components/layout/PlayerHud.tsx`) com displays diferentes por tema.
- Navegação inferior temática (`components/layout/BottomNav.tsx`).
- Trilha da Academia com animações e formas diferentes por tema (`pages/AcademyPage.tsx`).
- Player de lições cheio de feedback visual, XP progressivo e animações de sucesso (`pages/LessonPage.tsx`).
- Arena, desafios e missões diárias baseados em mock data (`pages/ArenaPage.tsx`, `pages/ChallengePage.tsx`, `pages/MissionsPage.tsx`).
- Perfil com personalização do Boto e troca de tema (`pages/ProfilePage.tsx`).

## Próximos passos sugeridos

1. Substituir os mocks do contexto (`contexts/AppDataContext.tsx`) por chamadas reais à API do servidor.
2. Adicionar testes para garantir que animações críticas e interações de quiz permaneçam consistentes.
3. Publicar a build estática em um CDN e plugar o backend quando a persistência estiver pronta.
