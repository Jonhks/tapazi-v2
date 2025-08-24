import { useParams } from "react-router-dom";

interface WIPProps {
  NCAAFemaleImg: string;
  NCAAMaleImg: string;
}

const WIP = ({ NCAAFemaleImg, NCAAMaleImg }: WIPProps) => {
  const params = useParams();

  const img = params.sport === "3" ? NCAAFemaleImg : NCAAMaleImg;
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
