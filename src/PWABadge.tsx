import classes from "./PWABadge.module.css";

import { useRegisterSW } from "virtual:pwa-register/react";
import { useVersionCheck } from "./hooks/useVersionCheck";

// mismo intervalo que useVersionCheck — solo revisa si hay un SW nuevo
// (registration.update() no lo activa, solo lo descarga en segundo plano;
// aplicar el cambio sigue siendo manual, vía el botón "Reload" de abajo).
const SW_UPDATE_CHECK_INTERVAL_MS = 5 * 60 * 1000;

function PWABadge() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      setInterval(() => {
        registration.update();
      }, SW_UPDATE_CHECK_INTERVAL_MS);
    },
  });

  const { needUpdate, dismiss } = useVersionCheck();

  const showToast = needRefresh || needUpdate;

  function close() {
    setNeedRefresh(false);
    dismiss();
  }

  async function handleReload() {
    if (needRefresh) {
      updateServiceWorker(true);
      return;
    }
    // Desregistrar SW y limpiar caché para que el reload traiga contenido fresco
    try {
      const regs = await navigator.serviceWorker?.getRegistrations() ?? [];
      await Promise.all(regs.map((r) => r.unregister()));
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch { /* ignore */ }
    window.location.reload();
  }

  return (
    <div
      className={classes.PWABadge}
      role="alert"
      aria-labelledby="toast-message"
    >
      {showToast && (
        <div className={classes.PWABadgeToast}>
          <div className={classes.PWABadgeMessage}>
            <span
              id="toastMessage"
              className={classes.toastMessage}
            >
              New version available: {import.meta.env.VITE_APP_VERSION} ({import.meta.env.VITE_APP_COMMIT})
              {"\n"}Click Reload to update.
            </span>
          </div>
          <div className={classes.PWABadgeButtons}>
            <button
              className={classes.PWABadgeToastButton}
              onClick={handleReload}
            >
              Reload
            </button>
            <button
              className={classes.PWABadgeToastButtonCancel}
              onClick={close}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PWABadge;
