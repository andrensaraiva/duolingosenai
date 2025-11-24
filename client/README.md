# BotoCode Academy – Client

Frontend React + Vite que reproduz a experiência do app Botocode com três temas visuais, HUD dinâmico e dados mockados. Tudo vive direto nesta pasta (sem `src/`): `App.tsx`, páginas em `pages/`, contexto em `contexts/` e componentes em `components/`.

## Rodando localmente

```powershell
npm install
npm run dev
```

O Vite sobe em `http://localhost:3000`. Como usamos `HashRouter`, os links funcionam mesmo em hospedagem estática.

## Variáveis de ambiente

- `.env.local` (opcional)
	- `GEMINI_API_KEY=<sua-chave>` para integrações futuras com Gemini.
	- `VITE_API_URL=http://localhost:4000/api` para apontar o frontend ao backend Express (padrão mostrado acima).

## Build

```powershell
npm run build
```

Os artefatos ficam em `dist/`. Faça deploy estático (Vercel, Netlify, Azure Static Web Apps etc.).

## Estrutura rápida

- `contexts/AppDataContext.tsx`: provê usuário, lições, missões e desafios mockados + troca dinâmica de tema.
- `pages/AcademyPage.tsx`: timeline animada da trilha.
- `pages/LessonPage.tsx`: player interativo com quizzes, reorder e animação de sucesso.
- `pages/ArenaPage.tsx`, `pages/ChallengePage.tsx`, `pages/MissionsPage.tsx`, `pages/ProfilePage.tsx`: experiências complementares.
- `components/ui/*`: avatar do Boto, botões temáticos e animações.
