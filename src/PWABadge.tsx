import classes from "./PWABadge.module.css";

import { useRegisterSW } from "virtual:pwa-register/react";

function PWABadge() {
  // check for updates every hour
  const period = 60 * 60 * 1000;

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === "activated") registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });

  function close() {
    setNeedRefresh(false);
  }

  return (
    <div
      className={classes.PWABadge}
      role="alert"
      aria-labelledby="toast-message"
    >
      {needRefresh && (
        <div className={classes.PWABadgeToast}>
          <div className={classes.PWABadgeMessage}>
            <span
              id="toastMessage"
              className={classes.toastMessage}
            >
              New content available, click on reload button to update.
            </span>
          </div>
          <div className={classes.PWABadgeButtons}>
            <button
              className={classes.PWABadgeToastButton}
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </button>
            <button
              className={classes.PWABadgeToastButton}
              onClick={() => close()}
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

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration
) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
