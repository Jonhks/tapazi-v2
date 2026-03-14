import classes from "./BallLoader.module.css";

interface Props {
  image: string;
  /** Rota la imagen (usado por EPL) */
  rotate?: boolean;
  /** Texto animado debajo: "ncaa" muestra "Load ng", "epl" muestra "Loading" con bola */
  variant?: "ncaa" | "epl";
}

const BallLoader = ({ image, rotate = false, variant = "ncaa" }: Props) => (
  <div className={classes.loaderContainer}>
    <img
      src={image}
      alt="loader"
      width={200}
      height={200}
      className={rotate ? classes.rotatingImage : undefined}
    />
    {variant === "ncaa" && (
      <span className={classes.loaderText}>Load&nbsp;ng</span>
    )}
    {variant === "epl" && <span className={classes.loaderEpl} />}
  </div>
);

export default BallLoader;
