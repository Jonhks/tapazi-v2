import classes from "./PWABadge.module.css";
import { useUpdateCheck } from "@/context/UpdateCheck";

function PWABadge() {
  const { needUpdate, reload, dismiss } = useUpdateCheck();

  return (
    <div
      className={classes.PWABadge}
      role="alert"
      aria-labelledby="toast-message"
    >
      {needUpdate && (
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
              onClick={reload}
            >
              Reload
            </button>
            <button
              className={classes.PWABadgeToastButtonCancel}
              onClick={dismiss}
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
