import SharedAppLayout from "@/shared/components/Layout/SharedAppLayout";
import MenuWorldCup from "../components/MenuWorldCup/MenuWorldCup";
import MenuMobileWorldCup from "../components/MenuWorldCup/MenuMobileWorldCup";

// TODO: reemplazar con la imagen de fondo oficial del World Cup cuando esté disponible
const BG_IMAGE =
  "https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/coming_soon_rose.png?quality=80&format=webp";

const AppLayoutWorldCup = () => {
  return (
    <SharedAppLayout
      menu={<MenuWorldCup />}
      menuMobile={<MenuMobileWorldCup />}
      backgroundImage={BG_IMAGE}
    />
  );
};

export default AppLayoutWorldCup;
