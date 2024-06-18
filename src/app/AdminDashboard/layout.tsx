"use client";
import React from "react";
import SideBar from "./components/SideBar";
import { CssBaseline, Stack } from "@mui/material";
import useAuth from "@/hooks/useIfAuth";
import NavBar from "./components/NavBar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const authorized = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Stack>
      <CssBaseline />
      <NavBar handleDrawerToggle={handleDrawerToggle} />
      <SideBar />
      <Stack alignItems={"center"} pl={9}>
        {children}
      </Stack>
    </Stack>
  );
};

export default Layout;
