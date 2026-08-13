import { forwardRef, ReactNode } from "react";
import styles from "./SplashStage.module.css";

interface Props {
  className?: string;
  label?: string;
  children?: ReactNode;
}

/**
 * Escenario negro a pantalla completa compartido por cada splash: fondo
 * profundo, viñeta cinematográfica, overflow clippeado y centrado.
 * Las raíces de los splashes reenvían aquí su ref de contexto de GSAP.
 */
export const SplashStage = forwardRef<HTMLDivElement, Props>(function SplashStage(
  { className, label, children },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`${styles.stage} ${className ?? ""}`}
      role="presentation"
      aria-label={label}
    >
      {children}
      <div
        className={styles.vignette}
        aria-hidden="true"
      />
    </div>
  );
});
