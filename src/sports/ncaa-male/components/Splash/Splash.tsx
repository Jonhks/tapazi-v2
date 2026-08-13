import { useCallback } from "react";
import { SplashMorph } from "@/shared/components/Splash/SplashMorph/SplashMorph";

const Splash = () => {
  const handleComplete = useCallback(() => {
    if (window.location.pathname !== "/") return;
    try {
      const raw = localStorage.getItem("userTapaszi");
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.id && user?.email) {
          window.location.pathname = `/sports/${user.id}`;
          return;
        }
      }
    } catch {
      // storage corrupto — ir a login
    }
    window.location.pathname = "/login";
  }, []);

  return (
    <SplashMorph
      duration={4}
      onComplete={handleComplete}
    />
  );
};

export default Splash;
