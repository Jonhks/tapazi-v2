import { Outlet, useParams } from "react-router-dom";
import classes from "./AuthLayout.module.css";
import Menu from "@/components/Menu/Menu";
import MenuMobile from "@/components/Menu/MenuMobile";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getScores } from "@/api/HomeAPI";
import { useQuery } from "@tanstack/react-query";

const AppLayout = () => {
  const params = useParams();
  const userId = params.userId!;
  const isMobile = useMediaQuery("(max-width:800px)");
  const { isLoading } = useQuery({
    queryKey: ["scores", userId],
    queryFn: () => getScores(userId),
  });
  return (
    <div className={classes.containerApp}>
      {!isMobile && !isLoading && <Menu />}
      <Outlet />
      {isMobile && !isLoading && <MenuMobile />}
    </div>
  );
};

export default AppLayout;
