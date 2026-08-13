const ComingSoonImg =
  "https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/coming_soon_rose.png?quality=80&format=webp";

const WIP = () => {
  return (
    <div>
      <img
        src={ComingSoonImg}
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
