/**
 * Estado de "hay una versión nueva" compartido entre PWABadge (el aviso
 * automático) y cualquier botón que quiera disparar el chequeo a mano (ej.
 * el ícono "Check for updates" del header). Un solo lugar de verdad para
 * no tener dos sistemas de detección de versión desincronizados.
 *
 * Nunca actualiza sola — checkNow() solo detecta y prende needUpdate;
 * aplicar el cambio (reload real) sigue siendo una acción explícita del
 * usuario vía reload().
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useVersionCheck } from "@/hooks/useVersionCheck";

const SW_UPDATE_CHECK_INTERVAL_MS = 5 * 60 * 1000;

interface UpdateCheckContextValue {
  needUpdate: boolean;
  /** Dispara el chequeo ahora mismo; devuelve true si encontró algo nuevo. */
  checkNow: () => Promise<boolean>;
  reload: () => Promise<void>;
  dismiss: () => void;
}

const UpdateCheckContext = createContext<UpdateCheckContextValue | null>(null);

export function UpdateCheckProvider({ children }: { children: ReactNode }) {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      registrationRef.current = registration ?? null;
      if (!registration) return;
      setInterval(() => {
        registration.update();
      }, SW_UPDATE_CHECK_INTERVAL_MS);
    },
  });

  const { needUpdate: needVersionUpdate, check, dismiss: dismissVersion } =
    useVersionCheck();

  const checkNow = useCallback(async () => {
    const found = await check();
    // dispara la revisión del SW en paralelo — si encuentra algo, needRefresh
    // se prende solo un momento después (reactivo, vía virtual:pwa-register).
    registrationRef.current?.update();
    return found;
  }, [check]);

  const reload = useCallback(async () => {
    if (needRefresh) {
      await updateServiceWorker(true);
      return;
    }
    try {
      const regs = (await navigator.serviceWorker?.getRegistrations()) ?? [];
      await Promise.all(regs.map((r) => r.unregister()));
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch {
      /* ignore */
    }
    window.location.reload();
  }, [needRefresh, updateServiceWorker]);

  const dismiss = useCallback(() => {
    setNeedRefresh(false);
    dismissVersion();
  }, [setNeedRefresh, dismissVersion]);

  const value = useMemo(
    () => ({
      needUpdate: needRefresh || needVersionUpdate,
      checkNow,
      reload,
      dismiss,
    }),
    [needRefresh, needVersionUpdate, checkNow, reload, dismiss],
  );

  return (
    <UpdateCheckContext.Provider value={value}>
      {children}
    </UpdateCheckContext.Provider>
  );
}

export function useUpdateCheck() {
  const ctx = useContext(UpdateCheckContext);
  if (!ctx) {
    throw new Error("useUpdateCheck debe usarse dentro de <UpdateCheckProvider>");
  }
  return ctx;
}
