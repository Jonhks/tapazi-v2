import { useMemo, CSSProperties } from "react";
import { createRandom, range } from "../utils/random";
import styles from "./ParticleField.module.css";

interface Props {
  count?: number;
  /** Semilla determinista — tamaños/opacidades. */
  seed?: number;
  color?: string;
  className?: string;
}

interface ParticleStyle extends CSSProperties {
  "--p-opacity"?: number;
}

/**
 * Pool de partículas brillantes, todas paradas en el centro del contenedor.
 * Los timelines las posicionan vía x/y de GSAP y las seleccionan con
 * `[data-particle]`.
 *
 * El render está memoizado: el pool nunca vuelve a renderizar durante la reproducción.
 */
export function ParticleField({
  count = 90,
  seed = 7,
  color = "var(--accent)",
  className,
}: Props) {
  const particles = useMemo(() => {
    const random = createRandom(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: range(random, 2, 5.5),
      baseOpacity: range(random, 0.55, 1),
    }));
  }, [count, seed]);

  return (
    <div
      className={`${styles.root} ${className ?? ""}`}
      style={{ "--particle-color": color } as CSSProperties}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          data-particle
          className={styles.particle}
          style={
            {
              width: p.size,
              height: p.size,
              "--p-opacity": p.baseOpacity,
            } as ParticleStyle
          }
        />
      ))}
    </div>
  );
}
