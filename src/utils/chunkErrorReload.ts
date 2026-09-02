// Después de un deploy, un tab que quedó abierto desde antes puede intentar
// bajar un chunk (import() dinámico de una ruta lazy) que el build nuevo ya
// no tiene — el navegador tira "Failed to fetch dynamically imported module"
// (o variantes según navegador). Sin esto, la app se queda en blanco/trabada
// sin ningún mensaje. Acá se detecta ese error puntual y se recarga UNA sola
// vez (sessionStorage evita loop si el problema es otro, ej. sin internet).

const CHUNK_ERROR_PATTERN =
  /dynamically imported module|importing a module script failed|failed to fetch dynamically imported module/i;

const RELOAD_FLAG_KEY = "chunk-reload-attempted";

export function isChunkLoadError(message: string | undefined | null): boolean {
  return Boolean(message && CHUNK_ERROR_PATTERN.test(message));
}

function reloadOnce() {
  if (sessionStorage.getItem(RELOAD_FLAG_KEY)) return false;
  sessionStorage.setItem(RELOAD_FLAG_KEY, "1");
  window.location.reload();
  return true;
}

/** Se llama una vez desde main.tsx — atrapa el caso de promesa rechazada suelta. */
export function setupChunkErrorReload() {
  window.addEventListener("unhandledrejection", (event) => {
    if (isChunkLoadError(event.reason?.message)) {
      reloadOnce();
    }
  });

  window.addEventListener("error", (event) => {
    if (isChunkLoadError(event.message)) {
      reloadOnce();
    }
  });
}

/** Se llama cuando una ruta cargó bien, para permitir un futuro reintento en la misma pestaña. */
export function clearChunkReloadFlag() {
  sessionStorage.removeItem(RELOAD_FLAG_KEY);
}

export { reloadOnce as reloadOnceForChunkError };
