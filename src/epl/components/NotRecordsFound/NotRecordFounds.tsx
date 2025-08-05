import Grid from "@mui/material/Grid2";

const NotRecordFounds = () => {
  return (
    <Grid
      size={10}
      display={"flex"}
      justifyContent={"center"}
    >
      <h2
        style={{
          fontSize: "3rem",
          backgroundColor: "#b45705",
          padding: "8px 16px",
          opacity: 0.8,
          color: "white",
        }}
      >
        Not Records Found!!
      </h2>
    </Grid>
  );
};

export default NotRecordFounds;
