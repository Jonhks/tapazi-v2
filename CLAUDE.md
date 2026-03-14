# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## Regla crítica: `src/lib/axios.ts`

**Este archivo NUNCA debe llegar a `master` a menos que el usuario lo indique explícitamente.**
- Al hacer merge o PR hacia `master`, verificar siempre que `src/lib/axios.ts` esté excluido del diff.
- Si el archivo aparece en el diff de un PR a `master`, detener y preguntar al usuario antes de continuar.
- Para excluirlo manualmente en un merge: `git checkout master -- src/lib/axios.ts` después del merge.

## Forma de trabajar

Antes de comenzar cualquier tarea:
1. **Entiende el contexto completo** — lee los archivos relevantes, rastrea el flujo de datos desde la API hasta el componente, y comprende cómo la pieza encaja en la arquitectura general.
2. **Si tienes dudas, pregunta** — nunca asumas. Si algo no está claro (comportamiento esperado, alcance del cambio, lógica de negocio), haz las preguntas necesarias antes de escribir código.

## Comandos

```bash
npm run dev        # Inicia el servidor de desarrollo (Vite)
npm run build      # Verifica tipos + compila para producción (tsc -b && vite build)
npm run lint       # Ejecuta ESLint
npm run preview    # Previsualiza el build de producción localmente
```

No hay test runner configurado.

## Arquitectura General

**Tapazi-v2** es una PWA (Progressive Web App) de gestión de portfolios deportivos, construida con React 18 + TypeScript + Vite. Los usuarios administran portfolios estilo fantasy en tres ligas: **NCAA Male**, **NCAA Female** y **EPL**.

### Módulos por Liga

La app está organizada en tres dominios de funcionalidad paralelos, cada uno con la misma estructura interna:

```
src/
  ncaa-male/   components/  layouts/  views/
  female/      components/  layouts/  views/
  epl/         components/  layouts/  views/
```

El código compartido vive en `src/shared/components/`, `src/hooks/`, `src/utils/` y `src/types/`.

> **Regla de imports entre ligas:** los módulos de liga (`ncaa-male/`, `female/`, `epl/`, `worldcup/`) **nunca deben importarse entre sí**. Si un componente se necesita en más de una liga, debe moverse a `src/shared/components/`. Los archivos locales dentro de cada liga pueden ser thin wrappers que re-exportan desde `shared/` con props específicas de la liga (color, imagen, etc.).

### Gestión de Estado

- **React Query (TanStack Query)** maneja todo el estado del servidor — fetching, caché y sincronización.
- **React Context (`PortfolioContext`)** envuelve la app con los resultados de React Query, exponiendo los datos de portfolio globalmente.
- **`src/providers/PortfolioProvider.tsx`** es el hub central — ejecuta todas las queries de alto nivel y provee los valores del contexto.
- **`src/context/PortfolioContext.tsx`** define la forma del contexto y el hook `usePortfolioContext()`.

### Capa de API

- Todas las llamadas HTTP pasan por los helpers de **`src/lib/apiClient.ts`**: `apiGet`, `apiPost`, `apiPut`, `apiDelete` — nunca usar `axios` directamente ni importar `src/lib/axios.ts` (un workflow de GitHub lo verifica).
- `apiClient.ts` siempre **lanza un error** en caso de fallo, lo que permite que `isError` de React Query funcione correctamente.
- Las funciones de API están organizadas por dominio en `src/api/`: `AuthAPI.ts`, `HomeAPI.ts`, `SportsAPI.ts`, `StatsAPI.ts`, `PortfoliosAPI.ts`, `HistoryAPI.ts`, y subcarpetas por liga (`epl/`, `female/`).
- La URL base se lee de la variable de entorno `VITE_API_URL` (entorno de prueba: `https://portfolio-pool-test.damnserver.com:443`).
- El éxito de la respuesta se detecta verificando `data.message === "success"`.

### Routing

- Definido en **`src/router.tsx`** usando React Router v7.
- La mayoría de las rutas se cargan de forma **lazy** (`React.lazy()` + `<Suspense>`).
- Las rutas protegidas usan `<PrivateRoute>` que llama al hook `useAuth()`.
- Los parámetros de ruta típicamente incluyen `userId` y `sportId`.
- Grupos de rutas principales: `/login`, `/signup` (auth); `/home/:userId` (NCAA Male); `/ncaa-female/home/:userId/:sportId`; `/epl/home/:userId/:sportId`.

### Autenticación

- **Basada en localStorage**: los datos del usuario se almacenan bajo la clave `userTapaszi`.
- El hook `useAuth()` en `src/hooks/AuthUser.ts` valida la sesión almacenada y redirige si es inválida.

### Tipos y Validación

- Los **esquemas Zod** en **`src/types/index.ts`** son la única fuente de verdad para todos los tipos del dominio.
- Los tipos TypeScript se derivan con `z.infer<typeof Schema>`.

### Hooks Personalizados

- `usePortfolioData` / `usePortfolioFemaleData` — fetching de datos por liga
- `usePortfolioActions` / `usePortfolioFemaleActions` — mutaciones (agregar/quitar selecciones)
- `usePortfolioValidation` — lógica de validación de selecciones

### Componentes Compartidos (`src/shared/components/`)

Componentes consolidados con props de tema para diferenciar ligas:

| Componente | Props de liga |
|---|---|
| `BallLoader/BallLoader.tsx` | `image`, `rotate?`, `variant?: "ncaa" \| "epl"` |
| `Inputs/Dropdown.tsx` | `menuBackground?` (color del panel desplegable) |
| `Inputs/DropdDownHistory.tsx` | `menuBackground?`, options con `value?` opcional |
| `Inputs/RadioButtonHistory.tsx` | `accentColor?` (color de los radio buttons) |
| `Table/TableHome.tsx` | `accentColor?` (color de encabezado) |
| `NotRecordsFound/NotRecordFounds.tsx` | — |
| `ErrorMessage/ErrorMessage.tsx` | — |
| `Graphics/` (6 archivos) | — (idénticos entre ligas) |

Los archivos locales de liga siguen siendo thin wrappers que pasan las props específicas. Por ejemplo `female/components/Inputs/RadioButtonHistory.tsx` solo hace `<SharedRadioButtonHistory {...props} accentColor="#df2af9" />`.

### UI

- **Material-UI (MUI v6)** para componentes, **Emotion** para estilos.
- Notificaciones: **React Toastify** (toasts) y **SweetAlert2** (modales).
- Tablas: **TanStack React Table v8**.
- Listas largas: **React-virtuoso** / **React-window** para virtualización.

### Configuración de Build

- **`vite.config.ts`**: alias `@` → `src/`, `@/epl` → `src/epl/`; chunk separado para vendor (React/React-DOM); plugin PWA con Workbox.
- Archivos de entorno: `.env`, `.env.development`, `.env.production`, `.env.local`.
