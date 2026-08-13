import { HTMLAttributes } from "react";
import styles from "./Glow.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** Diámetro en px. */
  size?: number;
  /** Color del núcleo. */
  color?: string;
  [dataAttr: `data-${string}`]: unknown;
}

/** Glow radial reutilizable. Centrado en su ancestro posicionado más cercano. */
export function Glow({ size = 320, color = "#8bc53f", className, style, ...rest }: Props) {
  return (
    <div
      className={`${styles.glow} ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
        ...style,
      }}
      aria-hidden="true"
      {...rest}
    />
  );
}
