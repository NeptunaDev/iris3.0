"use client";
import React from "react";
import SideBar from "./components/SideBar";
import { Box, CssBaseline, Stack } from "@mui/material";
import useAuth from "@/hooks/useIfAuth";
import NavBar from "./components/NavBar";

const DRAWER_WIDTH_OPEN = 220;
const DRAWER_WIDTH_CLOSED = 72;

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const authorized = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen((o) => !o);
  };

  return (
    <>
      <CssBaseline />
      <NavBar onMenuClick={handleDrawerToggle} />
      <SideBar
        open={drawerOpen}
        onToggle={handleDrawerToggle}
      />
      {/* Espaciador fijo + área main en la misma fila para que no haya hueco */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          minHeight: "100vh",
          pt: "64px",
          boxSizing: "border-box",
        }}
      >
        <Box
          component="span"
          aria-hidden
          sx={{
            width: drawerOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
            flexShrink: 0,
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
        />
        <Stack
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: "100vh",
            boxSizing: "border-box",
            bgcolor: "#fff",
          }}
        >
          <Box sx={{ width: "100%", flex: 1 }}>{children}</Box>
        </Stack>
      </Box>
    </>
  );
};

export default Layout;
