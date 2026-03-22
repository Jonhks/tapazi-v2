# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

| Módulo | Prefijo de rutas | Descripción |
|---|---|---|
| `src/ncaa-male/` | `/home`, `/myPortfolio`, `/stats`, `/history`, `/instructions` | NCAA Baloncesto Masculino (deporte por defecto) |
| `src/female/` | `/ncaa-female/...` | NCAA Baloncesto Femenino |
| `src/epl/` | `/epl/...` | English Premier League |

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

| `HomeAPI.ts` | `HomeAPIFemale.ts` | Endpoint |
|---|---|---|
| `getTournamentMale` | `getTournamentFemale` | `/sports/${id}/tournaments` — **idéntico** |
| `getParticipants` | `getParticipantsFemale` | `/tournaments/${id}/stats` — **idéntico** |
| `getHOINFO` | `getHOINFOFemale` | `/tournaments/${id}/parameters?key=HOINFO` — **idéntico** |
| `getPopona` | `getPoponaFemale` | `/tournaments/${id}/parameters?key=POPONA` — **idéntico** |

**Solución:** Consolidar en funciones genéricas en `src/api/shared/`:

```ts
// src/api/shared/TournamentAPI.ts
export const getTournaments = (sportId: string) => apiEnv(`/sports/${sportId}/tournaments`)
export const getParameter = (tournamentId: string, key: string) => apiEnv(`/tournaments/${tournamentId}/parameters?key=${key}`)
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
apiEnv.defaults.headers.common["Content-Type"] = "application/json;charset=utf-8";
```

---

### 5. Lógica `if` redundante en respuestas de API

**Problema:** El patrón `if(!data.x) return []; if(data.x) return data.x;` se repite en todas las funciones. El segundo `if` siempre es verdadero cuando el primero es falso, y hay código muerto después (`return data`):

```ts
// Patrón actual (redundante)
if(!data.tournaments) return [];
if(data.tournaments) return data.tournaments;  // siempre true aquí
return data;  // nunca se alcanza
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

### Prioridad sugerida de refactor

| Prioridad | Tarea | Impacto |
|---|---|---|
| Alta | Centralizar colores en `theme/colors.ts` y pasarlos por props | Desbloquea todo lo demás |
| Alta | Consolidar `Dropdown` duplicado (cambio mínimo, ganancia inmediata) | 1 componente en lugar de 3 |
| Alta | Mover header `Content-Type` al interceptor de Axios | Elimina ruido en toda la capa API |
| Media | Crear `TableBase` única con tema como prop | Elimina ~3 implementaciones duplicadas |
| Media | Consolidar funciones de API idénticas entre módulos | Reduce duplicación en `api/` |
| Media | Crear `MenuDrawer` único con `navItems[]` como prop | Elimina 6 archivos de menú |
| Baja | Tipar `Table.tsx` correctamente y eliminar `@ts-nocheck` | Mejora type safety |
| Baja | Simplificar lógica `if` redundante en API | Limpieza de código |
