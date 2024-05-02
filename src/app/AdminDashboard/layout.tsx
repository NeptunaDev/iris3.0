"use client";
import React from "react";
import SideBar from "./components/SideBar";
import { Box, Typography } from "@mui/material";
import useAuth from "@/hooks/useIfAuth";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const authorized = useAuth();

  return (
    <Box>
      <Box>
        <Box
          sx={{
            width: "250px",
          }}
        >
          <SideBar />
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
