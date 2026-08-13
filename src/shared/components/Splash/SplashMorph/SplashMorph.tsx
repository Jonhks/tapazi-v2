import { FIELD_SEQUENCE } from "../Fields";
import { Glow } from "../Lights/Glow";
import { ParticleField } from "../Particles/ParticleField";
import { PortfolioPoolLogo } from "../Logo/PortfolioPoolLogo";
import { SplashStage } from "../Stage/SplashStage";
import { useSplashTimeline } from "../hooks/useSplashTimeline";
import { useLatestRef } from "../hooks/useLatestRef";
import { buildMorphTimeline } from "./morphTimeline";
import shared from "../splashShared.module.css";

interface Props {
  /** Segundos totales (re-escala el timeline). */
  duration?: number;
  onComplete?: () => void;
}

/**
 * Morph Sports — el polvo de estrellas se junta y arma la cancha de cada
 * deporte de Tapazi, con un glow ambiental que cambia al color propio de
 * cada uno, hasta terminar en el logo.
 */
export function SplashMorph({ duration, onComplete }: Props) {
  const onCompleteRef = useLatestRef(onComplete);
  const { rootRef } = useSplashTimeline(
    (root, gsap) =>
      buildMorphTimeline({
        root,
        gsap,
        duration,
        onComplete: () => onCompleteRef.current?.(),
      }),
    [duration],
  );

  return (
    <SplashStage
      ref={rootRef}
      label="Morph Sports splash"
    >
      {FIELD_SEQUENCE.map((field) => (
        <Glow
          key={field.id}
          data-energy-glow={field.id}
          size={620}
          color={field.color}
        />
      ))}

      <div className={shared.fieldFrame}>
        {FIELD_SEQUENCE.map(({ id, Component }) => (
          <div
            key={id}
            data-field-layer
            data-field={id}
            className={shared.fieldLayer}
          >
            <div className={shared.fieldRotate}>
              <Component className={shared.fieldSvg} />
            </div>
          </div>
        ))}
      </div>

      <ParticleField
        count={140}
        seed={23}
        color="rgba(245, 245, 245, 0.95)"
        className={shared.particlesAbove}
      />

      <div className={shared.logoWrap}>
        <Glow
          data-logo-glow
          size={340}
          color={FIELD_SEQUENCE[FIELD_SEQUENCE.length - 1].color}
        />
        <PortfolioPoolLogo
          data-logo
          className={shared.logo}
        />
      </div>
    </SplashStage>
  );
}

export default SplashMorph;
