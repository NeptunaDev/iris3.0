import { Box, Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "30px"
      }}
    >
      <Typography sx={{ fontWeight: "bold" }}>Iris Admin</Typography>
      <Typography sx={{ fontWeight: "bold" }}>
        Derechos Reservados 2024
      </Typography>
    </Box>
  );
};

export default Footer;
