import { useState, useEffect, useCallback } from "react";

export function useVersionCheck() {
  const [needUpdate, setNeedUpdate] = useState(false);
  const currentVersion = import.meta.env.VITE_APP_VERSION as string;

  const check = useCallback(async () => {
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const { version } = await res.json();
      if (version && version !== currentVersion) {
        setNeedUpdate(true);
      }
    } catch {
      // Network error — silently ignore
    }
  }, [currentVersion]);

  useEffect(() => {
    check();
  }, [check]);

  return { needUpdate, dismiss: () => setNeedUpdate(false) };
}
