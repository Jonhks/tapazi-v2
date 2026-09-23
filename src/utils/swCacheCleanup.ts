// Desregistra todos los service workers y borra todo el caché de Cache API,
// con un timeout de por si algún paso se cuelga (pasa seguido con service
// workers) — usado tanto por el reload de "hay una versión nueva" como por
// el reset completo de datos locales.
export async function clearServiceWorkerAndCaches(
  timeoutMs = 3000,
): Promise<void> {
  const cleanup = async () => {
    const regs = (await navigator.serviceWorker?.getRegistrations()) ?? [];
    await Promise.all(regs.map((r) => r.unregister()));
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
  };
  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs));
  try {
    await Promise.race([cleanup(), timeout]);
  } catch {
    /* ignore — quien llama recarga la página de todos modos */
  }
}
