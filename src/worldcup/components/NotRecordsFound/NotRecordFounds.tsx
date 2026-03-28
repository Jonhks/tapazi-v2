import Grid from "@mui/material/Grid2";

const NotRecordFounds = () => {
  return (
    <Grid size={10} display={"flex"} justifyContent={"center"}>
      <h2
        style={{
          fontSize: "3rem",
          backgroundColor: "#00292C",
          border: "2px solid #00E2F6",
          padding: "8px 16px",
          opacity: 0.9,
          color: "#00E2F6",
        }}
      >
        Not Records Found!!
      </h2>
    </Grid>
  );
};

export default NotRecordFounds;
