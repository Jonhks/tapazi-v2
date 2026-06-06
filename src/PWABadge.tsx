import classes from "./PWABadge.module.css";

import { useRegisterSW } from "virtual:pwa-register/react";
import { useVersionCheck } from "./hooks/useVersionCheck";

function PWABadge() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const { needUpdate, dismiss } = useVersionCheck();

  const showToast = needRefresh || needUpdate;

  function close() {
    setNeedRefresh(false);
    dismiss();
  }

  function handleReload() {
    if (needRefresh) {
      updateServiceWorker(true);
    } else {
      window.location.reload();
    }
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
              New version available: {import.meta.env.VITE_APP_VERSION}
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
