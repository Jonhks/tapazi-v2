import loader from "@/assets/img/loader.gif";
import BallLoader from "@/shared/components/BallLoader/BallLoader";

const Loader = () => (
  <BallLoader
    image={loader}
    variant="ncaa"
  />
);

export default Loader;
