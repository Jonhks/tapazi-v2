import { useParams } from "react-router-dom";

const NCAAFemaleImg =
  "https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/coming_soon_rose.png?quality=80&format=webp";
// const NCAAMaleImg =
//   "https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/coming_soon_orange.png?quality=80&format=webp";

const WIP = () => {
  const params = useParams();

  const img = NCAAFemaleImg;
  console.log(params);

  return (
    <div>
      <img
        src={img}
        alt="WIP"
        width={"100%"}
        style={{
          height: "100vh",
          objectFit: "contain",
          backgroundColor: "black",
        }}
      />
    </div>
  );
};

export default WIP;
