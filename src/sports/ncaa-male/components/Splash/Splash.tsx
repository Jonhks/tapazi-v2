import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SplashMorph } from "@/shared/components/Splash/SplashMorph/SplashMorph";

const Splash = () => {
  const navigate = useNavigate();

  const handleComplete = useCallback(() => {
    if (window.location.pathname !== "/") return;
    try {
      const raw = localStorage.getItem("userTapaszi");
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.id && user?.email) {
          navigate(`/sports/${user.id}`);
          return;
        }
      }
    } catch {
      // storage corrupto — ir a login
    }
    navigate("/login");
  }, [navigate]);

  return (
    <SplashMorph
      duration={4}
      onComplete={handleComplete}
    />
  );
};

export default Splash;
