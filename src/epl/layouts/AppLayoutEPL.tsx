import { Outlet, useParams } from "react-router-dom";
import classes from "./AuthLayout.module.css";
import MenuEPL from "@/epl/components/MenuEPL/MenuEPL";
import MenuMobileEPL from "@/epl/components/MenuEPL/MenuMobileEPL";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getScores } from "@/api/HomeAPI";
import { useQuery } from "@tanstack/react-query";

const AppLayoutEPL = () => {
  const params = useParams();
  const userId = params.userId!;
  const isMobile = useMediaQuery("(max-width:800px)");
  const { isLoading } = useQuery({
    queryKey: ["scores", userId],
    queryFn: () => getScores(userId),
  });

  return (
    <div className={classes.containerApp}>
      {!isMobile && !isLoading && <MenuEPL />}
      <Outlet />
      {isMobile && !isLoading && <MenuMobileEPL />}
    </div>
  );
};

export default AppLayoutEPL;
