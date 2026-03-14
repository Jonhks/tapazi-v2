import SharedBackgroundLayout from "@/shared/components/Layout/SharedBackgroundLayout";

// TODO: reemplazar con imagen oficial de instrucciones World Cup
const BG_IMAGE =
  "https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/coming_soon_rose.png?quality=80&format=webp";

const InstructionsWorldCupLayout = () => (
  <SharedBackgroundLayout backgroundImage={BG_IMAGE} />
);

export default InstructionsWorldCupLayout;
