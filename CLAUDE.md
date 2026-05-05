# CLAUDE.md

Guía de referencia para Claude al trabajar en este repositorio.

---

## Reglas de colaboración

### Antes de mover o reorganizar archivos
**Siempre preguntar primero.** Antes de mover, renombrar o reorganizar cualquier archivo o carpeta, Claude debe:
1. Explicar qué va a mover y por qué.
2. Describir el impacto (qué imports/aliases se romperían y cómo se repararían).
3. Esperar confirmación explícita del usuario antes de ejecutar el cambio.

### Documentar cambios importantes
Cualquier cambio relevante en arquitectura, patrones nuevos, o módulos nuevos debe documentarse en este mismo archivo (`CLAUDE.md`) al momento de realizarse — no después. Esto incluye:
- Nuevos módulos de deporte
- Cambios en el sistema de rutas
- Nuevas carpetas compartidas (`shared/`)
- Decisiones de diseño que afecten a más de un archivo

---

## Convenciones UX importantes

### Scrollbars siempre visibles

El cliente final usa Windows con mouse y arrastra las barras de scroll directamente. Las barras deben ser **siempre visibles**, no aparecer solo al hacer hover.

**Regla global:** `src/index.css` configura scrollbars globalmente para Chrome/Edge (webkit) y Firefox. No hay que añadir nada extra — el sistema global cubre todo.

```css
/* Ya definido en index.css — NO repetir en componentes */
*::-webkit-scrollbar { width: 8px; height: 8px; }
*::-webkit-scrollbar-track { background: rgba(0,0,0,0.15); }
*::-webkit-scrollbar-thumb { background-color: #888; border-radius: 4px; }
```

**Regla en contenedores:** usar siempre `overflow: "scroll"` (no `"auto"`). Con `"auto"` las barras solo aparecen cuando hay desbordamiento y el usuario no sabe que puede scrollear. Con `"scroll"` las barras son permanentemente visibles.

```css
/* Correcto */
overflow-x: scroll;
overflow-y: scroll;   /* o "visible" si no hay maxHeight */

/* Evitar */
overflow: auto;
overflow-x: auto;
```

**Clases utilitarias eliminadas:** `enable-horizontal-scroll` y `enable-vertical-scroll` fueron eliminadas de todo el proyecto. Ya no existen ni deben usarse — el comportamiento correcto es el default global.

---

## Comandos

```bash
npm run dev       # Inicia el servidor Vite con HMR
npm run build     # Compilación TypeScript + build de producción con Vite
npm run lint      # Revisa ESLint (sin auto-fix)
npm run preview   # Previsualiza el build de producción localmente
```

Verificación de tipos: `npx tsc -b --noEmit` (debe pasar sin errores antes de hacer commit).

No hay framework de pruebas configurado.

---

## Arquitectura

**SPA / PWA** construida con React 18 + TypeScript. Solo frontend — todos los datos vienen de una API REST externa configurada en `src/lib/axios.ts`. Se despliega en Vercel.

### Estructura de `src/`

```
src/
├── sports/           ← módulos por deporte (ncaa-male, female, epl, worldcup)
├── shared/           ← componentes, tablas, menús y temas compartidos entre deportes
├── api/              ← capa de datos: shared/ + carpeta por deporte
├── hooks/            ← custom hooks de portfolio y fetching (uno por deporte)
├── context/          ← solo AuthUser.ts (auth context)
├── types/            ← interfaces TypeScript y esquemas Zod
├── utils/            ← helpers puros (fórmulas, dropdowns, transformaciones)
├── lib/axios.ts      ← instancia Axios con interceptor Content-Type global
├── router.tsx        ← rutas lazy-loaded con BrowserRouter
└── index.css         ← reset global + scrollbar styles
```

### Módulos por deporte — `src/sports/`

Cada módulo tiene su propia carpeta con `components/`, `layouts/` y `views/`:

| Módulo                   | Prefijo de rutas                                               | Alias           |
| ------------------------ | -------------------------------------------------------------- | --------------- |
| `src/sports/ncaa-male/`  | `/home`, `/myPortfolio`, `/stats`, `/history`, `/instructions` | `@/ncaa-male`   |
| `src/sports/female/`     | `/ncaa-female/...`                                             | `@/female`      |
| `src/sports/epl/`        | `/epl/...`                                                     | `@/epl`         |
| `src/sports/worldcup/`   | `/worldcup/...`                                                | `@/worldcup`    |

Las rutas de autenticación (`/login`, `/signup`, `/forgot`) y el selector de deporte (`/sports/:userId`) son compartidas y usan layouts de `ncaa-male/layouts/`.

### Código compartido — `src/shared/`

```
src/shared/
├── components/
│   ├── Table/
│   │   ├── TableBase.tsx                       ← tabla genérica con TanStack Table
│   │   ├── BallSvg.tsx                         ← ícono SVG de baloncesto
│   │   ├── TableHistoryAllRounds.tsx           ← con useVirtualizer
│   │   ├── TableHistoryMostPickedTeams.tsx
│   │   ├── TableHistoryPerfectPortfolios.tsx
│   │   ├── TableHistoryPerfectPortfoliosSelected.tsx
│   │   ├── TableHistoryTeamsNotPicked.tsx
│   │   ├── TableHistoryTeamsPerYearLog.tsx
│   │   ├── TableHistoryTeamsPerYearLogSelected.tsx
│   │   ├── TablePortfolioSeedSelections.tsx
│   │   ├── TableSeedPickTotal.tsx
│   │   └── TableTeamsPickedLog.tsx
│   ├── Inputs/
│   │   └── Dropdown.tsx                        ← dropdown único con prop menuBgColor?
│   ├── Menu/
│   │   ├── MenuDrawer.tsx                      ← sidebar de escritorio genérico
│   │   └── MenuMobile.tsx                      ← barra inferior móvil genérica
│   └── WalletModal/
│       └── WalletModal.tsx
└── theme/
    └── colors.ts                               ← tokens de color por deporte (sportThemes)
```

**Tablas:** cada módulo de deporte conserva solo su `Table.tsx` wrapper (thin wrapper que inyecta el `SportTheme` correcto en `TableBase`) y las tablas específicas de ese módulo (`TableTeamsPicked`, `TablePortfolioWeekStats`, `TableHomeEpl`). Las 10 tablas de historial/stats son compartidas.

**Menú:** `MenuDrawer` usa un `<Box position="fixed">` custom en lugar del `<Drawer variant="permanent">` de MUI, lo que permite controlar la altura del sidebar (termina después del último nav item, no va a full viewport height). Cada módulo tiene su propio wrapper de ~10 líneas que configura colores y navItems.

**Colores:** `sportThemes` en `colors.ts` es la fuente de verdad.

**TableBase — props opcionales avanzadas** (todas con default no-op, no rompen consumidores existentes):

| Prop | Tipo | Para qué |
| ---- | ---- | -------- |
| `stickySecondColumn` | `boolean` | Hace sticky la columna 1 (Portfolio ID en EPL) |
| `col0Width` | `number` (default 120) | Ancho de col 0 para posicionar correctamente col 1 sticky |
| `highlightColBg` | `(colId, idx) => string \| null` | Resalta columnas por condición (ej. semana activa en verde) |
| `headerTooltip` | `(colId, idx) => string \| null` | Tooltip en el header de la columna | Props clave: `headerEven`, `headerOdd`, `cellEvenColEvenRow`, `cellEvenColOddRow`, `cellOddColEvenRow`, `cellOddColOddRow`, `accent`, `text`, `searchBg`.

### Capa de API — `src/api/`

```
src/api/
├── shared/
│   ├── TournamentsAPI.ts    ← getTournaments(sportId), getParticipants, getParameter
│   └── ReportsAPI.ts        ← 12 funciones de reportes reutilizadas por todos los deportes
├── ncaa-male/               ← HomeAPI, HistoryAPI, PortfoliosAPI, StatsAPI
├── female/                  ← HomeAPIFemale, HistoryFemaleAPI, StatsFemaleAPI, ...
├── epl/                     ← HomeEplApiEpl, HistoryEPLAPI, StatsEplAPI, ...
├── worldcup/                ← HomeAPIWorldCup, HistoryAPIWorldCup, ...
├── AuthAPI.ts
├── SportsAPI.ts
└── WalletAPI.ts
```

`src/lib/axios.ts` configura el header `Content-Type: application/json;charset=utf-8` **una sola vez** en el interceptor global — no se repite en cada función.

Patrón de respuesta: `return data.x ?? fallback` (sin if redundantes).

> **⚠️ Limpieza pendiente:** Los archivos `src/api/HomeAPI.ts`, `StatsAPI.ts`, `HistoryAPI.ts` y `PortfoliosAPI.ts` son re-exportadores obsoletos. Borrarlos cuando sea conveniente:
> ```bash
> git rm src/api/HomeAPI.ts src/api/StatsAPI.ts src/api/HistoryAPI.ts src/api/PortfoliosAPI.ts
> ```

### Path Aliases (Vite + TypeScript)

Los aliases están definidos como **array ordenado** en `vite.config.ts` (los específicos antes que el genérico `@`):

```
@/epl/*        → src/sports/epl/*
@/ncaa-male/*  → src/sports/ncaa-male/*
@/female/*     → src/sports/female/*
@/worldcup/*   → src/sports/worldcup/*
@/shared/*     → src/shared/*
@/*            → src/*
```

### API y entorno

- `VITE_API_URL` controla la URL base; `.env.development` apunta al servidor de test, `.env.production` al de producción.
- `src/lib/axios.ts` está en `.gitignore`. Un workflow de GitHub Actions (`protect-axios.yml`) bloquea PRs a `main` que lo modifiquen.
- Todas las rutas protegidas se envuelven en `<PrivateRoute>`.

### Flujo de datos

1. Las funciones en `src/api/` hacen llamadas con Axios y devuelven datos validados con esquemas Zod de `src/types/`.
2. TanStack Query maneja el estado del servidor (caché, refetching) en toda la app.
3. Cada deporte tiene sus propios hooks de portfolio (`usePortfolioXxxData` + `usePortfolioXxxActions`) — no hay estado global compartido entre deportes.

### Patrón de hooks por deporte — `src/hooks/`

Todos los deportes siguen el mismo patrón de dos hooks locales:

| Deporte     | Hook de datos                  | Hook de acciones                  |
| ----------- | ------------------------------ | --------------------------------- |
| NCAA Male   | `usePortfolioData.ts`          | `usePortfolioActions.ts`          |
| NCAA Female | `usePortfolioFemaleData.ts`    | `usePortfolioFemaleActions.ts`    |
| World Cup   | `usePortfolioWorldCupData.ts`  | `usePortfolioWorldCupActions.ts`  |
| EPL         | `usePortfolioEplData.ts`       | `usePortfolioEplActions.ts`       |

**Hook de datos** recibe `(userId, sportId)` y devuelve: `validTournament`, `AllPortfolios`, `teamsComplete`, `teamsBloqued`, `selectedTeams`, `teamsDynamics`, `weekParameter`, `numberInputs`, `tournamentId`, `isLoadingData`.

**Hook de acciones** recibe esos datos como props y devuelve: `getSeed`, `getMultiplier`, `areAllInputsValid`, `addportFolioAlert`, `cancelAlert`.

`sportId` y `tournamentId` son **siempre dinámicos** — vienen de los URL params (`useParams`) y de la primera query al backend. Ningún ID está hardcodeado en los hooks ni en la API de EPL.

### Compensación de sidebar en layouts

El sidebar permanente ocupa ~65 px en desktop. Todos los layouts de app tienen el siguiente media query para compensarlo:

```css
@media (min-width: 800px) {
  .containerApp,
  .containerHistory,
  .containerStats {
    padding-left: 65px;
  }
}
```

`MenuDrawer` también renderiza un `<DrawerHeader />` (no fixed, en el flujo del DOM) que actúa como espaciador de 64 px para empujar el contenido debajo del AppBar fijo.

---

## Referencia de API (Postman collection)

Base URL: `{{host}}:{{port}}` → configurada en `VITE_API_URL` vía `.env`.

### Participants
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/participants/signup` | Registro. Body: `{ code, name, surname, email, username, password, country_id, state_id }` |
| POST | `/participants/login` | Login. Body: `{ user, password }` |
| POST | `/participants/forgot` | Recuperar contraseña. Body: `{ user }` |
| GET | `/participants/:id/portfolios?tournament_id=&sport=` | Portfolios del participante |
| GET | `/participants/:id/sports` | Deportes del participante |
| GET | `/participants/:id/wallet-transactions` | Historial de transacciones de la billetera |
| GET | `/participants/:id/wallet-totals` | Totales de la billetera (in/out acumulados) |
| GET | `/participants/:id/wallet-remaining` | Balance actual disponible |

### Portfolios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/portfolios/:id/per-week?week=` | Stats del portfolio por semana |
| POST | `/portfolios` | **Crear** portfolio. Body: `{ tournament_id, participant_id, championship_points, teams: [{id, seed, streak_multiplier}] }` |
| PUT | `/portfolios/:id` | **Actualizar** equipos del portfolio. Body: `{ teams: [{id, seed, streak_multiplier}] }` |
| PUT | `/portfolios/:id/remove?tournament_id=` | **Soft-remove** (desregistrar) portfolio de torneo |
| DELETE | `/portfolios/:id` | **Eliminar** portfolio permanentemente |

### Sports
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/sports` | Lista de deportes |
| GET | `/sports/:id/teams?sport=&tournament_id=` | Equipos del deporte |
| GET | `/sports/:id/teams/not-available?tournament_id=&sport=` | Equipos no disponibles |
| GET | `/sports/:id/teams/dynamics?tournament_id=&portfolio_id=` | Dinámica de equipos |
| GET | `/sports/:id/tournaments` | Torneos del deporte |

### Tournaments
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tournaments/:id` | Detalle del torneo |
| GET | `/tournaments/:id/instructions` | Instrucciones del torneo |
| GET | `/tournaments/:id/match-probabilities?sport=` | Probabilidades de partidos |
| GET | `/tournaments/:id/payouts?portfolios=` | Estructura de pagos |
| GET | `/tournaments/:id/parameters?key=` | Parámetro por clave (HOINFO, POPONA, DATTOU, HOUTOU, WEETOU, RECODE…) |
| GET | `/tournaments/:id/score/home?participant_id=&sport=` | Score para Home |
| GET | `/tournaments/:id/score/stats?sport=&round=&order=` | Stats de scores |
| GET | `/tournaments/:id/score/points-per-round?sport=` | Puntos por ronda |
| GET | `/tournaments/:id/score/weeks` | Semanas del torneo |
| GET | `/tournaments/:id/score/stats/portfolio?week=` | Stats de portfolio por semana |
| GET | `/tournaments/:id/stats` | Estadísticas generales |
| GET | `/tournaments/:id/teams?sport=&show_all=` | Equipos del torneo |
| GET | `/tournaments/:id/winner-of-team?sport=&limit=` | Winner-of-team entries |
| GET | `/tournaments/:id/winner-of-team-has-team?sport=&winner_of_team_id=` | Equipos en un winner-of-team |

### Reports
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/reports/least-picked-teams?tournament_id=` | Equipos menos elegidos |
| GET | `/reports/most-picked-teams?tournament_id=` | Equipos más elegidos |
| GET | `/reports/teams-picked-log?tournament_id=` | Log de equipos elegidos |
| GET | `/reports/teams-picked-log-history?tournament_id=&year=` | Historial de equipos elegidos |
| GET | `/reports/teams-not-picked-log?tournament_id=` | Log de equipos no elegidos |
| GET | `/reports/portfolio-seed-selections?tournament_id=` | Selecciones por seed |
| GET | `/reports/seed-pick-totals?tournament_id=` | Totales por seed |
| GET | `/reports/historical-perfect-portfolios-header` | Encabezados de portfolios perfectos |
| GET | `/reports/historical-perfect-portfolios-history?year=` | Historial de portfolios perfectos |
| GET | `/reports/historical-perfect-portfolios-weight?year=` | Pesos de portfolios perfectos |
| GET | `/reports/teams-per-year-log?tournament_id=` | Log de equipos por año |
| GET | `/reports/historical-all-rounds?order-by=` | Historial de todas las rondas |

### Countries
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/countries` | Lista de países |
| GET | `/countries/:id/states` | Estados del país |

---

## Manual: subir cambios a otras ramas

### Contexto

La rama de desarrollo activa es `refactor/shared-components` (o la rama de trabajo actual). Cuando se quiera escalar cambios a `qa`, `dev` o `main`, hay que hacerlo con la estrategia `-s ours` para no perder el contenido nuevo.

### El flujo correcto: merge `-s ours`

`-s ours` registra el merge (GitHub lo acepta sin conflictos) pero conserva **todo el contenido de la rama fuente** sin tocar nada.

```bash
# Paso 1 — verificar que estás en la rama correcta y limpia
git checkout refactor/shared-components
git status

# Paso 2 — merge con la rama destino
git fetch origin <destino>          # qa | dev | main
git merge -s ours origin/<destino> --no-edit
git push origin refactor/shared-components

# Paso 3 — crear el PR
gh pr create --base <destino> --head refactor/shared-components
```

### Si algo salió mal

```bash
git log --oneline -10               # encuentra el commit bueno
git reset --hard <hash>
git push --force origin refactor/shared-components
```

> **Regla de oro:** Nunca `git pull origin <otra-rama>` directo. Siempre `git fetch` + `git merge -s ours origin/<rama>` + `git push`.

---

## Deuda técnica pendiente

### Alta prioridad

| Tarea | Archivos | Detalle |
| ----- | -------- | ------- |
| Borrar archivos `*-copia` / `* copy` | `ncaa-male/views/myPortfolio/MyPortfolio-copia.tsx`, `epl/views/myPortfolioEPL/MyPortfolioEPL copy.tsx`, `epl/views/StatsEpl/StatsEpl copy.tsx` | Duplicados sin usar. El copy de StatsEpl está prácticamente entero comentado. `git rm` directo. |
| SportId hardcodeado en menús como `"1"` | `female/components/Menufemale/MenuFemale.tsx` y `MenuMobilefemale.tsx`, `epl/components/MenuEPL/MenuEPL.tsx` y `MenuMobileEPL.tsx` | Todos usan `params.sportId \|\| "1"` como fallback. Female debería ser `"3"`, EPL `"2"`. Si el param no llega el menú apunta al sport equivocado. |
| WorldCup vistas con TODO sin implementar | `worldcup/views/Stats/StatsWorldCup.tsx`, `worldcup/views/HistoryPortfolios/HistoryWorldCup.tsx`, `api/worldcup/*.ts` | Varias vistas dicen "Adaptar de ncaa-male". Las APIs tienen TODO para confirmar endpoints con el back. Funciona porque comparte lógica de male, pero no está validado. |
| EPL `Table.tsx` sin uso — borrar | `sports/epl/components/Table/Table.tsx` | El componente existe pero ningún archivo lo importa. `HomeEPL` usa `TablesEpl/TableHomeEpl.tsx` directamente (ya migrado a `TableBase`). Borrar con `git rm`. |

### Media prioridad

| Tarea | Archivos | Detalle |
| ----- | -------- | ------- |
| `@ts-nocheck` en hooks de portfolio | `hooks/usePortfolioWorldCupData.ts`, `hooks/usePortfolioWorldCupActions.ts`, `hooks/usePortfolioFemaleData.ts`, `hooks/usePortfolioEplData.ts`, `hooks/usePortfolioEplActions.ts`, y las 4 vistas de MyPortfolio | Desactiva completamente el type checker. Reemplazar con tipos correctos de TanStack Query y los propios tipos del proyecto. |
| `WalletModal` es un placeholder | `shared/components/WalletModal/WalletModal.tsx` | Tiene `FAKE_WALLET` hardcodeado como fallback. Intenta llamar a `getWallet()` pero cae siempre al fake si hay error. Necesita integración real con la API de wallet. |
| Borrar 4 re-exportadores obsoletos en `src/api/` | `api/HomeAPI.ts`, `api/StatsAPI.ts`, `api/HistoryAPI.ts`, `api/PortfoliosAPI.ts` | Son wrappers vacíos que re-exportan desde `ncaa-male/`. `git rm src/api/HomeAPI.ts src/api/StatsAPI.ts src/api/HistoryAPI.ts src/api/PortfoliosAPI.ts` |
| `ErrorMessage` duplicado | `src/components/ErrorMessage/` (global) y `sports/epl/components/ErrorMessage/` | Dos implementaciones del mismo componente. Unificar en shared/ o usar solo el global. |
| Dependencias posiblemente sin usar | `package.json` | `alertify@0.3.0` (deprecada, no aparece en imports) y `chance@1.1.13` (generación aleatoria — ¿es de debug?) — verificar y borrar si no se usan. |
| Magic numbers en hooks de portfolio | `hooks/usePortfolioActions.ts`, `hooks/usePortfolioWorldCupActions.ts` | `Array(8).fill(false)` sin constante nombrada. NCAA/Female/WorldCup = 8 equipos, EPL = variable (viene de API). Crear constante `TEAM_COUNT` por deporte. |
| `console.log` activos en API de EPL | `api/epl/PortfoliosEplAPI.ts` | 7 `console.log` sin comentar: en `getTeamsNotAvailable` (sport/tournamentId), `postNewPortfolioEpl` (nombre de función + data), `postEditPortfolio` (nombre de función + data), `removeportfolio` (data). Borrar todos. |
| Función huérfana `getTeamsDynamic` (singular) | `api/epl/PortfoliosEplAPI.ts` línea ~70 | Existe `getTeamsDynamic` (sin "s") que no tiene ningún uso en el proyecto — la versión correcta y usada es `getTeamsDynamics` (con "s"). Borrar la huérfana. |
| Imports sin usar en `HomeEPL.tsx` | `epl/views/HomeEPL/HomeEPL.tsx` líneas 16, 20 | `getScoreHomeEpl` importado pero no referenciado en el JSX; `TableHomeEpl` importado pero tampoco renderizado actualmente. Limpiar o reconectar. |

### Baja prioridad

| Tarea | Archivos | Detalle |
| ----- | -------- | ------- |
| MUI class selectors hardcodeados en CSS | `src/index.css` | `.css-1tktgsa-...` y `.css-d1xm6m` son clases generadas por MUI — pueden cambiar entre versiones. Reemplazar con `sx` props en los componentes correspondientes. |
| `eslint-disable` sin justificación | `ncaa-male/views/myPortfolio/MyPortfolio.tsx`, `female/views/PortfolioFemale/PortfolioFemale.tsx`, `epl/views/myPortfolioEPL/MyPortfolioEPL.tsx`, `worldcup/views/myPortfolio/MyPortfolioWorldCup.tsx` | Deshabilitan `no-extra-boolean-cast` y `no-unsafe-optional-chaining` sin comentario de por qué. Idealmente arreglar el código subyacente. |
| Código comentado masivo | `ncaa-male/views/Stats/Stats.tsx` (imports comentados al inicio) | Imports de funciones que ya no se usan, dejados como referencia. Limpiar. |
