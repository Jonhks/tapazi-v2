import { useParams } from "react-router-dom";

const WIP = () => {
  const params = useParams();

  const img =
    params.sport === "nacca-female"
      ? "https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/coming_soon_rose.png?quality=80&format=webp"
      : "https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/coming_soon_orange.png?quality=80&format=webp";

  // cometarios innecesarios

  return (
    <div>
      <img
        src={img}
        alt="WIP"
        width={"100%"}
        style={{ height: "100vh", objectFit: "cover" }}
      />
    </div>
  );
};

export default WIP;
