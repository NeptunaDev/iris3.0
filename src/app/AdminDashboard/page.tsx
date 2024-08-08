// pages/AdminDashboard.tsx
import React from "react";
import {
  Box,
  Card,
  Stack,
  CssBaseline,
  Container,
  Typography,
} from "@mui/material";
import CustomDoughnut from "./components/CustomDoughnut";
import AccesCard from "./components/AccesCard";
import PortalViewCard from "./components/PortalViewCard";
import UniqueDevicesCard from "./components/UniqueDevicesCard";
import DonutSitestPage from "./components/DonutSites";
import DonutAgesPage from "./components/DonutAges";

const AdminDashboard = () => {
  return (
    <Container
      sx={{
        backgroundColor: "white",
        borderRadius: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CssBaseline />
      <Stack
        sx={{ justifyContent: "center", alignItems: "center", pb: "2rem" }}
      >
        <Typography sx={{ fontWeight: "Bold", fontSize: "2rem" }}>
          Datos Sobre el Portal:
        </Typography>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent={'space-between'}
          width={'100%'}
          gap = {2}
        >
          <PortalViewCard />
          <AccesCard />
          <UniqueDevicesCard />
        </Stack>
      </Stack>
        <Stack sx = {{mt: '2rem', flexDirection: 'row', }}>
          <DonutSitestPage/>
          <DonutAgesPage/>
        </Stack>
    </Container>
  );
};

export default AdminDashboard;
