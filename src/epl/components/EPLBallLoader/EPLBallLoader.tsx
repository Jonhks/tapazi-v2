import loader from "@/assets/img/ball-epl.png";
import BallLoader from "@/shared/components/BallLoader/BallLoader";

const EPLBallLoader = () => (
  <BallLoader
    image={loader}
    rotate
    variant="epl"
  />
);

export default EPLBallLoader;
