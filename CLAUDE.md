# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Reglas de colaboración

### Antes de mover o reorganizar archivos
**Siempre preguntar primero.** Antes de mover, renombrar o reorganizar cualquier archivo o carpeta, Claude debe:
1. Explicar qué va a mover y por qué.
2. Describir el impacto (qué imports/aliases se romperían y cómo se repararían).
3. Esperar confirmación explícita del usuario antes de ejecutar el cambio.

### Documentar cambios importantes
Cualquier cambio relevante en arquitectura, patrones nuevos, o módulos nuevos debe documentarse en este mismo archivo (`CLAUDE.md`) al momento de realizarse — no después. Esto incluye:
- Nuevos módulos de deporte (`worldcup`, etc.)
- Cambios en el sistema de rutas
- Nuevas carpetas compartidas (`shared/`)
- Decisiones de diseño que afecten a más de un archivo

## Convenciones UX importantes

### Scrolls en tablas

Usar siempre `overflow: "scroll"` (no `"auto"`) en los contenedores de tabla. Los usuarios de este proyecto arrastran las barras de scroll manualmente — con `"auto"` las barras solo aparecen cuando hay desbordamiento y el usuario no sabe que puede scrollear. Con `"scroll"` las barras siempre son visibles.

```css
/* Correcto */
overflowX: "scroll"
overflowY: "scroll"   /* o "visible" si no hay maxHeight */

/* Evitar */
overflow: "auto"

poner barra de desplazamiento siempre a las tablas y vistas que sobre pasen el tamaño de la pantalla
```

## Comandos

```bash
npm run dev       # Inicia el servidor Vite con HMR
npm run build     # Compilación TypeScript + build de producción con Vite
npm run lint      # Revisa ESLint (sin auto-fix)
npm run preview   # Previsualiza el build de producción localmente
```

No hay framework de pruebas configurado.

## Arquitectura

Es una **SPA / PWA** construida con React 18 + TypeScript. Solo frontend — todos los datos vienen de una API REST externa configurada en `src/lib/axios.ts`. Se despliega en Vercel.

### Módulos por deporte

El proyecto está dividido en tres módulos paralelos, cada uno con `components/`, `layouts/` y `views/`:

| Módulo              | Prefijo de rutas                                               | Descripción                                     |
| ------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| `src/ncaa-male/`    | `/home`, `/myPortfolio`, `/stats`, `/history`, `/instructions` | NCAA Baloncesto Masculino (deporte por defecto) |
| `src/female/`       | `/ncaa-female/...`                                             | NCAA Baloncesto Femenino                        |
| `src/epl/`          | `/epl/...`                                                     | English Premier League                          |
| `src/worldcup/`     | `/worldcup/...`                                                | Copa del Mundo (tema teal/cyan oscuro)          |

Los colores de worldcup están centralizados en `src/shared/theme/colors.ts` bajo la clave `worldcup`. Es el primer módulo en usar el sistema de colores centralizado.

Las rutas de autenticación (`/login`, `/signup`, `/forgot`) y el selector de deporte (`/sports/:userId`) son compartidas y usan layouts de `ncaa-male/layouts/`.

### Estructura de `src/`

- `api/` — Funciones de servicio con Axios por deporte/dominio (`AuthAPI.ts`, `HomeAPI.ts`, `PortfoliosAPI.ts`, `StatsAPI.ts`, `HistoryAPI.ts`, `SportsAPI.ts`, `epl/`, `female/`)
- `hooks/` — Custom hooks para acciones de portfolio, fetching de datos y validaciones
- `context/` + `providers/` — `PortfolioContext` / `PortfolioProvider` envuelve todo el router para estado compartido
- `types/` — Interfaces TypeScript y esquemas Zod para validar respuestas de la API
- `utils/` — Helpers puros (fórmulas, datos de dropdowns, transformaciones)
- `lib/axios.ts` — Creación de la instancia Axios (está en .gitignore en producción; el fallback en el repo apunta al servidor de test)
- `router.tsx` — Todas las rutas definidas con componentes lazy-loaded dentro de `<PortfolioProvider>`

### Path Aliases

Tanto TypeScript como Vite resuelven `@/` a `src/`. Aliases principales:

```
@/api/*     → src/api/*
@/hooks/*   → src/hooks/*
@/types/*   → src/types/*
@/utils/*   → src/utils/*
@/lib/*     → src/lib/*
@/assets/*  → src/assets/*
@/epl/*     → src/epl/*
```

Los aliases `@/components/*`, `@/views/*` y `@/layouts/*` apuntan a directorios de alto nivel en `src/` (no a los específicos de cada deporte).

### API y entorno

- La variable de entorno `VITE_API_URL` controla la URL base; `.env.development` apunta al servidor de test, `.env.production` al de producción.
- `src/lib/axios.ts` está en `.gitignore`. Un workflow de GitHub Actions (`protect-axios.yml`) bloquea PRs a `main` que lo modifiquen.
- Todas las rutas protegidas se envuelven en `<PrivateRoute>`.

### Flujo de datos

1. Las funciones en `src/api/` hacen llamadas con Axios y devuelven datos validados con esquemas Zod de `src/types/`.
2. TanStack Query maneja el estado del servidor (caché, refetching) en toda la app.
3. `PortfolioContext` mantiene el estado de selección de portfolio compartido entre módulos.

---

## Lista de mejoras detectadas

Esta sección documenta deuda técnica concreta encontrada en el código actual. Sirve como guía de refactor progresivo.

### 1. Componentes duplicados entre módulos — `Table`, `Dropdown`, `Menu`

**Problema:** Los mismos componentes existen copiados en los tres módulos con diferencias mínimas.

- **Tablas:** `src/ncaa-male/components/Table/Table.tsx`, `src/female/components/Table/Table.tsx` y `src/epl/components/Table/Table.tsx` son tres implementaciones distintas del mismo concepto (`TableBase` con TanStack Table). Además, hay ~10 tablas específicas duplicadas entre los tres módulos (`TableHistoryMostPickedTeams`, `TableHistoryPerfectPortfolios`, `TableTeamsPickedLog`, etc.).

- **Dropdown:** `src/ncaa-male/components/Inputs/Dropdown.tsx` y `src/female/components/Inputs/Dropdown.tsx` son prácticamente idénticos — la única diferencia es el color de fondo del menú (`rgba(0,0,0,0.9)` vs `rgba(36,37,62,0.9)`).

- **Menú:** Los primeros ~55 líneas de `src/ncaa-male/components/Menu/Menu.tsx` y `src/epl/components/MenuEPL/MenuEPL.tsx` son idénticos (imports MUI, `openedMixin`, `closedMixin`, `drawerWidth`). Lo mismo aplica para las versiones mobile.

**Solución:** Crear `src/shared/components/` con versiones únicas que reciban colores y datos por props.

```
src/shared/
├── components/
│   ├── Table/       ← TableBase genérica con colores como props
│   ├── Dropdown/    ← único Dropdown con menuBgColor?: string
│   └── Menu/        ← único MenuDrawer con navItems[] y accent color como props
```

---

### 2. Colores hardcodeados en lugar de un tema centralizado

**Problema:** Los colores están dispersos en inline styles y CSS Modules sin ninguna fuente de verdad única. Ejemplos directos del código:

```ts
// ncaa-male/Table.tsx — colores de celda hardcodeados
const headerBgColor = (index) => index % 2 === 0 ? "#0d0d0d" : "#1a1a1a";
const cellBgColor = ...  "#0d0d0d", "#141414", "#1a1a1a", "#212121"

// epl/Table.tsx — tema morado completamente distinto
backgroundColor: "#380F55"  // header par
backgroundColor: "#2C0C37"  // header impar
backgroundColor: "#220931"  // celda par
backgroundColor: "#19071F"  // celda impar

// Dropdown.tsx ncaa-male vs female
backgroundColor: "rgba(0, 0, 0, 0.9)"      // ncaa-male
backgroundColor: "rgba(36, 37, 62, 0.9)"   // female
```

**Solución:** Crear `src/shared/theme/colors.ts` con los tokens de color por deporte y pasar la paleta como prop al componente compartido:

```ts
// src/shared/theme/colors.ts
export const sportThemes = {
  ncaaMale:  { headerEven: "#0d0d0d", headerOdd: "#1a1a1a", ... },
  ncaaFemale:{ headerEven: "#0d0d0d", headerOdd: "#1a1a1a", ... },
  epl:       { headerEven: "#380F55", headerOdd: "#2C0C37", ... },
}
```

---

### 3. Funciones de API duplicadas entre módulos

**Problema:** `src/api/HomeAPI.ts` y `src/api/female/HomeAPIFemale.ts` son casi idénticos. Llaman a los mismos endpoints con la misma lógica y solo cambian los nombres de función. Ejemplos:

| `HomeAPI.ts`        | `HomeAPIFemale.ts`      | Endpoint                                                  |
| ------------------- | ----------------------- | --------------------------------------------------------- |
| `getTournamentMale` | `getTournamentFemale`   | `/sports/${id}/tournaments` — **idéntico**                |
| `getParticipants`   | `getParticipantsFemale` | `/tournaments/${id}/stats` — **idéntico**                 |
| `getHOINFO`         | `getHOINFOFemale`       | `/tournaments/${id}/parameters?key=HOINFO` — **idéntico** |
| `getPopona`         | `getPoponaFemale`       | `/tournaments/${id}/parameters?key=POPONA` — **idéntico** |

**Solución:** Consolidar en funciones genéricas en `src/api/shared/`:

```ts
// src/api/shared/TournamentAPI.ts
export const getTournaments = (sportId: string) =>
  apiEnv(`/sports/${sportId}/tournaments`);
export const getParameter = (tournamentId: string, key: string) =>
  apiEnv(`/tournaments/${tournamentId}/parameters?key=${key}`);
```

---

### 4. Header `Content-Type` repetido en cada llamada de API

**Problema:** Cada función de la capa API repite el mismo header en cada llamada individual:

```ts
// Esto se repite literalmente en todas las ~30+ funciones de API
await apiEnv(url, {
  headers: { "Content-Type": "application/json;charset=utf-8" },
});
```

**Solución:** Configurar el header una sola vez en el interceptor de Axios en `src/lib/axios.ts`:

```ts
apiEnv.defaults.headers.common["Content-Type"] =
  "application/json;charset=utf-8";
```

---

### 5. Lógica `if` redundante en respuestas de API

**Problema:** El patrón `if(!data.x) return []; if(data.x) return data.x;` se repite en todas las funciones. El segundo `if` siempre es verdadero cuando el primero es falso, y hay código muerto después (`return data`):

```ts
// Patrón actual (redundante)
if (!data.tournaments) return [];
if (data.tournaments) return data.tournaments; // siempre true aquí
return data; // nunca se alcanza
```

**Solución:** Simplificar a:

```ts
return data.tournaments ?? [];
```

---

### 6. `// @ts-nocheck` en componente principal de tabla

**Problema:** `src/ncaa-male/components/Table/Table.tsx` tiene `// @ts-nocheck` en la primera línea, desactivando toda la verificación de tipos en ese archivo.

**Solución:** Tipar correctamente usando los genéricos de `@tanstack/react-table` en lugar de suprimir TypeScript.

---

### 7. Label hardcodeado `"Age"` en el Dropdown

**Problema:** En ambas versiones del `Dropdown.tsx` hay un prop `label="Age"` hardcodeado en el componente `<Select>` que nunca se usa correctamente:

```tsx
// Dropdown.tsx — ncaa-male y female
<Select label="Age" ...>  // debería ser label={label}
```

---

### 8. Tablas específicas triplicadas sin necesidad

**Problema:** Las siguientes tablas existen copiadas en `ncaa-male/`, `female/` y `epl/components/Table/` con diferencias mínimas de tipado o color:

- `TableHistoryMostPickedTeams`
- `TableHistoryPerfectPortfolios` / `TableHistoryPerfectPortfoliosSelected`
- `TableHistoryTeamsPerYearLog` / `TableHistoryTeamsPerYearLogSelected`
- `TableHistoryTeamsNotPicked`
- `TableTeamsPickedLog`
- `TablePortfolioSeedSelections`
- `TableSeedPickTotal`

**Solución:** Mover a `src/shared/components/Table/` y pasar tipos e inyección de colores por props o por `sportThemes`.

---

### 9. Estructura de carpetas: separar `shared` de los módulos de deporte

**Estructura sugerida a largo plazo:**

```
src/
├── shared/
│   ├── components/   ← Table, Dropdown, Menu, etc.
│   ├── theme/        ← colors.ts, tokens de diseño por deporte
│   ├── hooks/        ← hooks reutilizables entre deportes
│   └── api/          ← funciones de API genéricas (tournaments, parameters, etc.)
├── ncaa-male/
├── female/
├── epl/
├── api/              ← solo funciones específicas de cada deporte
└── ...
```

---

### 10. Reorganizar carpetas de módulos en `src/sports/` — ✅ HECHO

**Problema:** Las carpetas `epl/`, `ncaa-male/`, `female/` y `worldcup/` vivían directamente en `src/`, lo que hacía la raíz confusa a medida que crecen los módulos.

**Solución ejecutada:** Los cuatro módulos se movieron dentro de `src/sports/`:
```
src/sports/
├── ncaa-male/
├── female/
├── epl/
└── worldcup/
```

**Cambios aplicados:**
- `vite.config.ts` — aliases `@/epl`, `@/ncaa-male`, `@/female`, `@/worldcup` apuntan a `src/sports/*/`
- `tsconfig.app.json` — paths actualizados a `sports/epl/*`, `sports/ncaa-male/*`, etc.
- `src/router.tsx` — todos los lazy imports cambiados de `./ncaa-male/` → `./sports/ncaa-male/`, etc.
- `epl/layouts/HistoryLayout.tsx` — imports bare `ncaa-male/...` → `@/ncaa-male/...`
- `epl/views/HistoryPortfolios/HistoryPortfolios.tsx` — 5 imports bare → `@/ncaa-male/...`
- `epl/components/Modal/TableModal.tsx` — import relativo `../../../types` corregido a `../../../../types`
- `tsc -b` pasa sin errores tras los cambios.

---

### Prioridad sugerida de refactor

| Prioridad | Estado | Tarea                                                               | Impacto                                |
| --------- | ------ | ------------------------------------------------------------------- | -------------------------------------- |
| Alta      | ✅ HECHO | Consolidar `Dropdown` duplicado → `src/shared/components/Inputs/` | 1 componente en lugar de 3             |
| Alta      | ✅ HECHO | Mover header `Content-Type` al interceptor de Axios               | Elimina 129 líneas repetidas en 21 archivos |
| Alta      | ✅ HECHO | `src/shared/theme/colors.ts` ya existe con los 4 temas            | Base para la TableBase compartida      |
| Media     | ✅ HECHO | Crear `TableBase` única en `src/shared/components/Table/`        | Elimina ~4 implementaciones duplicadas |
| Media     | ✅ HECHO | Incorporar click-to-fetch (prop `onCellClick?`) en TableBase     | Ya incluido en TableBase compartida    |
| Media     | ✅ HECHO | Mover tablas específicas duplicadas a `src/shared/`              | Elimina ~7 tablas triplicadas + fix bug EPL |
| Media     | ✅ HECHO | Consolidar funciones de API idénticas en `src/api/shared/`       | Reduce duplicación en `api/`           |
| Media     | ✅ HECHO | Crear `src/api/ncaa-male/` con re-exports + funciones específicas | Carpeta por deporte, backwards compat  |
| Media     | ✅ HECHO | Crear `MenuDrawer` único con `navItems[]` como prop              | Elimina 8 archivos de menú (4 desktop + 4 mobile) |
| Baja      | ✅ HECHO | Tipar `TableTeamsPicked` y `TablePortfolioWeekStats`, eliminar `@ts-nocheck` | Type safety completo en tablas |
| Baja      | ✅ HECHO | Simplificar lógica `if` redundante en API (EPL + female)      | Patrón `??` / ternario en lugar de doble-if |
| Baja      | ✅ HECHO | Mover módulos de deporte a `src/sports/` (Step 10)            | Raíz de `src/` limpia, 4 aliases actualizados |

---

## Manual: subir cambios de `refactor/shared-components` a otras ramas

### Contexto
`refactor/shared-components` es la **fuente de verdad**. Contiene un refactor grande (nueva estructura de carpetas, componentes compartidos, etc.). Cuando se quiera escalar estos cambios a `qa`, `dev` o `main` (prod), hay que hacerlo con cuidado para no perder la estructura nueva.

### Por qué NO hacer `git pull origin <rama-destino>` directo

Si haces `git pull origin qa` (o cualquier otra rama) estando en `refactor/shared-components`, git intentará hacer un merge bidireccional. Esto puede sobrescribir la estructura nueva con la antigua y generar conflictos que, al resolverse mal, destruyen el trabajo del refactor.

### El flujo correcto: merge `-s ours`

La estrategia `-s ours` registra que el merge ocurrió (para que GitHub lo acepte y no muestre conflictos), pero conserva **todo el contenido de `refactor/shared-components`** sin tocar nada.

#### Paso 1 — Asegurarte de estar en la rama correcta y con los cambios listos

```bash
git checkout refactor/shared-components
git status          # debe estar limpio (sin cambios pendientes)
git log --oneline -3   # verifica que el último commit es el que quieres mandar
```

#### Paso 2 — Bajar la rama destino y hacer el merge con `-s ours`

**Para subir a `qa`:**
```bash
git fetch origin qa
git merge -s ours origin/qa --no-edit
git push origin refactor/shared-components
```

**Para subir a `dev`:**
```bash
git fetch origin dev
git merge -s ours origin/dev --no-edit
git push origin refactor/shared-components
```

**Para subir a `main` (prod):**
```bash
git fetch origin main
git merge -s ours origin/main --no-edit
git push origin refactor/shared-components
```

#### Paso 3 — Crear el PR desde GitHub o con `gh`

```bash
# PR hacia qa
gh pr create --base qa --head refactor/shared-components

# PR hacia dev
gh pr create --base dev --head refactor/shared-components

# PR hacia main
gh pr create --base main --head refactor/shared-components
```

Después del merge `-s ours`, GitHub no mostrará conflictos y el botón "Merge pull request" estará activo.

### Si algo salió mal y la rama quedó en un estado roto

Identifica el último commit bueno con `git log --oneline` y resetea a él:

```bash
git log --oneline -10   # encuentra el commit hash del estado bueno
git reset --hard <hash-del-commit-bueno>
git push --force origin refactor/shared-components
```

Luego vuelve al Paso 2 y repite el proceso limpio.

### Regla de oro

> **Nunca** hagas `git pull origin <otra-rama>` desde `refactor/shared-components` sin usar `-s ours`.
> Siempre: `git fetch` + `git merge -s ours origin/<rama>` + `git push`.

---

## Historial de refactor

### Rama: `refactor/shared-components` (creada desde `mundial`, 2026-04-11)

**Commit 1 — Dropdown + Axios**
- `src/shared/components/Inputs/Dropdown.tsx` — componente único que reemplaza las 3 copias en ncaa-male, female, epl. Props: `menuBgColor?`, `icon?`. Corrige bug de `label="Age"` hardcodeado.
- `src/lib/axios.ts` — header `Content-Type` movido al interceptor global. Eliminado de 21 archivos de API (129 líneas).

**Commit 2 — TableBase compartida**
- `src/shared/components/Table/TableBase.tsx` — TableBase genérica con TanStack Table. Props clave: `theme: SportTheme`, `hideSearch?`, `accentFirstColumn?`, `onCellClick?` (click-to-fetch listo para EPL).
- `ncaa-male/Table.tsx` → wrapper con `sportThemes.ncaaMale`. Elimina `@ts-nocheck` y ~200 líneas de código duplicado.
- `female/Table.tsx` → wrapper con `sportThemes.ncaaFemale` + `accentFirstColumn`. Misma reducción.
- `worldcup/Table.tsx` → wrapper con `sportThemes.worldcup` + `accentFirstColumn`. Ya usaba colors.ts, ahora usa la TableBase compartida.
- `epl/Table.tsx` → sin cambios (usa MUI styled, patrón distinto — se migra en fase siguiente).
- Las tablas específicas (`TableHistoryMostPickedTeams`, etc.) **no requieren cambios** — importan `TableBase` de su `Table.tsx` local y reciben el tema automáticamente vía wrapper.

**Commit 3 — Tablas específicas compartidas**
- `src/shared/components/Table/BallSvg.tsx` — ícono de baloncesto extraído a componente independiente.
- 9 tablas específicas migradas a `src/shared/components/Table/`:
  - `TableHistoryMostPickedTeams` — props: `arrHistory, score, least?, theme`
  - `TableHistoryTeamsNotPicked` — props: `arrHistory, score, theme`
  - `TableTeamsPickedLog` — props: `arrHistory, score, theme`
  - `TablePortfolioSeedSelections` — props: `arrHistory, score, theme`
  - `TableSeedPickTotal` — props: `arrHistory, score, theme`
  - `TableHistoryPerfectPortfolios` — props: `arrHistory, score, theme`
  - `TableHistoryPerfectPortfoliosSelected` — props: `arrHistory, score, TeamPerfectPortfoliosSelected?, theme`
  - `TableHistoryTeamsPerYearLog` — props: `arrHistory, score, theme`
  - `TableHistoryTeamsPerYearLogSelected` — props: `arrHistory, score, teamsPerYearLogSelected?, theme`
  - `TableHistoryAllRounds` — usa `useVirtualizer` (solo esta tabla), props: `arrHistory, score, isFetching?, theme`
- **Bug corregido:** `epl/views/HistoryPortfolios/HistoryPortfolios.tsx` importaba tablas desde `ncaa-male/components/Table/` → ahora usa `@/shared/` con `sportThemes.epl`. EPL History ya muestra colores morados correctos.
- 5 vistas consumidoras actualizadas (imports → `@/shared/`, prop `theme` agregado):
  - `ncaa-male/views/Stats/Stats.tsx` → `sportThemes.ncaaMale`
  - `ncaa-male/views/HistoryPortfolios/HistoryPortfolios.tsx` → `sportThemes.ncaaMale`
  - `female/views/StatsFemale/StatsFemale.tsx` → `sportThemes.ncaaFemale`
  - `female/views/HistoryFemale/HistoryFemale.tsx` → `sportThemes.ncaaFemale`
  - `epl/views/HistoryPortfolios/HistoryPortfolios.tsx` → `sportThemes.epl`
- Todas las tablas compartidas usan `overflowX/Y: "scroll"` (nunca `"auto"`).
- `@ts-nocheck` eliminado de todas las tablas compartidas — tipado completo con generics de TanStack Table.

**Commit 4 — Limpieza y seguridad de props**
- Archivos a eliminar (ejecutar `git rm` manualmente — ver instrucciones abajo): las 11 tablas duplicadas en `ncaa-male/components/Table/`, `female/components/Table/` y `epl/components/Table/` que ya están en `src/shared/`.
- `ncaa-male/views/Stats/Stats.tsx` — guards añadidos:
  - `handleChange`: `if (!optionSelect) return;` antes de `setSubDataSelected(subDataDropDown[...])`
  - `handleChangeSubData`: `if (!selected[0]) return;` antes de `setRound(...)`
  - `value={subDataSelected[idSubDataSelected]?.name ?? ""}` en los 2 lugares donde aparece (previene crash cuando index queda fuera de rango)
- `female/views/StatsFemale/StatsFemale.tsx` — mismos guards aplicados (3 cambios idénticos).

**Commit 5 — Refactor de API: carpetas por deporte + shared**
- `src/api/shared/TournamentsAPI.ts` — funciones genéricas: `getTournaments(sportId)`, `getParticipants(tournamentId)`, `getParameter(tournamentId, key)`.
- `src/api/shared/ReportsAPI.ts` — 12 funciones de reportes compartidas: `getTeamsPicked`, `getMostPickedTeams`, `getLeastPickedTeams`, `getTeamsNotPickedLog`, `getTeamsPickedLog`, `getSeedPickTotal`, `getPortfolioSeedSelections`, `getTeamsPerYearLog`, `getTeamsPerfectPortfolios`, `getTeamsHistoricAllRounds`, `getHistoricalPerfectPortfoliosHistory`, `getTeamsPickedLogHistory`. Usan patrón `data.x ?? fallback` (sin ifs redundantes).
- `src/api/ncaa-male/HomeAPI.ts` — usa shared + funciones específicas de male (getScores, gatPayout, getInstructions).
- `src/api/ncaa-male/PortfoliosAPI.ts` — re-exports de shared + funciones específicas de portfolios.
- `src/api/ncaa-male/StatsAPI.ts` — re-exports de ReportsAPI + funciones específicas (getScoreWeeksMale, getPortfolioStatsWeek, getNcaaMaleTeams).
- `src/api/ncaa-male/HistoryAPI.ts` — re-exports de ReportsAPI + `getTournaments` como wrapper de sport ID "1".
- `src/api/female/HomeAPIFemale.ts` — refactorizado para usar shared.
- `src/api/female/StatsFemaleAPI.ts` — re-exports de ReportsAPI con alias `Female`.
- `src/api/female/HistoryFemaleAPI.ts` — re-exports de ReportsAPI con alias `Female`, sport ID "3".
- Imports actualizados en 8 archivos consumidores: `ncaa-male/views/home/Home.tsx`, `InstructionsPortfolios.tsx`, `HistoryPortfolios.tsx`, `Stats.tsx`, `src/hooks/usePortfolioData.ts`, `usePortfolioActions.ts`, `epl/views/HistoryPortfolios.tsx` (→ `@/api/shared/ReportsAPI`), archivos `-copia`.
- **Archivos raíz obsoletos a borrar** (ejecutar en terminal): `src/api/HomeAPI.ts`, `src/api/StatsAPI.ts`, `src/api/HistoryAPI.ts`, `src/api/PortfoliosAPI.ts`.

```bash
git rm src/api/HomeAPI.ts src/api/StatsAPI.ts src/api/HistoryAPI.ts src/api/PortfoliosAPI.ts
```

---

**Commit 6 — MenuDrawer y MenuMobile compartidos**
- `src/shared/components/Menu/MenuDrawer.tsx` — sidebar de escritorio genérico. Props clave: `navItems: NavItem[]`, `activeColor`, `defaultColor`, `appBarBgColor`, `drawerBgColor`, `titleColor`, `sportKey`, `sportFrom`, `swal: SwalConfig`, `showUsernameInBar?`.
- `src/shared/components/Menu/MenuMobile.tsx` — barra inferior móvil genérica. Props clave: `navItems`, `activeColor`, `appBarBgColor`, `menuPaperBgColor`, `sportKey`, `sportFrom`, `swal`, `usernameLabelColor?`.
- Tipos exportados: `NavItem`, `SwalConfig`, `MenuDrawerProps` en `MenuDrawer.tsx`.
- `isActive()` unificado: usa `parts.find(p => ACTIVE_SEGMENTS.includes(p))` — funciona para todas las variantes de ruta (con prefijo de deporte, con slash inicial, sin prefijo).
- `isMoreItem()` en MenuMobile: detecta el ítem de popup por `id === "more" || id.endsWith("/more")`.
- 8 archivos de menú convertidos a wrappers (~10 líneas c/u):
  - `ncaa-male/components/Menu/Menu.tsx` → `activeColor="#05fa87"`, `appBar="#000"`
  - `ncaa-male/components/Menu/MenuMobile.tsx` → `appBar="#000"`, `menuPaper="rgba(0,0,0,0.8)"`
  - `female/components/Menufemale/MenuFemale.tsx` → `activeColor="#e040fb"`, `appBar="rgba(36,37,62,0.95)"`
  - `female/components/Menufemale/MenuMobilefemale.tsx` → `appBar="#24253e"`, `menuPaper="rgba(36,37,62,0.95)"`
  - `epl/components/MenuEPL/MenuEPL.tsx` → `activeColor="#4BF589"`, `appBar="#380f51"`, `showUsernameInBar=false`
  - `epl/components/MenuEPL/MenuMobileEPL.tsx` → `appBar="#380f51"`, `usernameLabelColor="#4BF589"`
  - `worldcup/components/Menu/MenuWorldCup.tsx` → colores desde `sportThemes.worldcup`, rutas con `/` absoluto
  - `worldcup/components/Menu/MenuWorldCupMobile.tsx` → rutas absolutas `/worldcup/...`

---

**Para borrar las tablas obsoletas, ejecutar en terminal:**
```bash
git rm src/ncaa-male/components/Table/TableHistory.tsx \
       src/ncaa-male/components/Table/TableHistoryAllRounds.tsx \
       src/ncaa-male/components/Table/TableHistoryMostPickedTeams.tsx \
       src/ncaa-male/components/Table/TableHistoryPerfectPortfolios.tsx \
       src/ncaa-male/components/Table/TableHistoryPerfectPortfoliosSelected.tsx \
       src/ncaa-male/components/Table/TableHistoryTeamsNotPicked.tsx \
       src/ncaa-male/components/Table/TableHistoryTeamsPerYearLog.tsx \
       src/ncaa-male/components/Table/TableHistoryTeamsPerYearLogSelected.tsx \
       src/ncaa-male/components/Table/TablePortfolioSeedSelections.tsx \
       src/ncaa-male/components/Table/TableSeedPickTotal.tsx \
       src/ncaa-male/components/Table/TableTeamsPickedLog.tsx \
       src/female/components/Table/TableHistory.tsx \
       src/female/components/Table/TableHistoryAllRounds.tsx \
       src/female/components/Table/TableHistoryMostPickedTeams.tsx \
       src/female/components/Table/TableHistoryPerfectPortfolios.tsx \
       src/female/components/Table/TableHistoryPerfectPortfoliosSelected.tsx \
       src/female/components/Table/TableHistoryTeamsNotPicked.tsx \
       src/female/components/Table/TableHistoryTeamsPerYearLog.tsx \
       src/female/components/Table/TableHistoryTeamsPerYearLogSelected.tsx \
       src/female/components/Table/TablePortfolioSeedSelections.tsx \
       src/female/components/Table/TableSeedPickTotal.tsx \
       src/female/components/Table/TableTeamsPickedLog.tsx \
       src/epl/components/Table/TableHistory.tsx \
       src/epl/components/Table/TableHistoryAllRounds.tsx \
       src/epl/components/Table/TableHistoryMostPickedTeams.tsx \
       src/epl/components/Table/TableHistoryPerfectPortfolios.tsx \
       src/epl/components/Table/TableHistoryPerfectPortfoliosSelected.tsx \
       src/epl/components/Table/TableHistoryTeamsNotPicked.tsx \
       src/epl/components/Table/TableHistoryTeamsPerYearLog.tsx \
       src/epl/components/Table/TableHistoryTeamsPerYearLogSelected.tsx \
       src/epl/components/Table/TablePortfolioSeedSelections.tsx \
       src/epl/components/Table/TableSeedPickTotal.tsx \
       src/epl/components/Table/TableTeamsPickedLog.tsx
```

---

**Commit 7 — Step 10: módulos de deporte → `src/sports/`**
- Carpetas movidas: `src/ncaa-male/` → `src/sports/ncaa-male/`, `src/epl/` → `src/sports/epl/`, `src/female/` → `src/sports/female/`, `src/worldcup/` → `src/sports/worldcup/`.
- `vite.config.ts` — aliases `@/epl`, `@/ncaa-male`, `@/female`, `@/worldcup` apuntan a `src/sports/*/`.
- `tsconfig.app.json` — paths actualizados (todos los módulos de deporte ahora bajo `sports/`).
- `src/router.tsx` — 20+ lazy imports actualizados (`./ncaa-male/` → `./sports/ncaa-male/`, etc.).
- `src/sports/epl/layouts/HistoryLayout.tsx` — imports bare `"ncaa-male/..."` → `"@/ncaa-male/..."`.
- `src/sports/epl/views/HistoryPortfolios/HistoryPortfolios.tsx` — 5 imports bare → `@/ncaa-male/...`.
- `src/sports/epl/components/Modal/TableModal.tsx` — import de tipos corregido a `"../../../../types"`.
- `tsc -b` pasa sin errores.
