"use client"
import React from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar";
import { Box, Button, CssBaseline, Typography } from "@mui/material";
import  useAuth  from "@/hooks/useIfAuth";
import { deleteCookie } from "cookies-next";

const Layout = () => {
  const authorized = useAuth();
  if(authorized){
    return (
      <Box>
        {/* <NavBar /> */}
        <Box>
          <Box
            sx={{
              width: "250px"
            }}
          >
            <SideBar />
          </Box>
        </Box>
      </Box>
    );
  } else {
    <Typography>No estas logued</Typography>
  }
};

export default Layout;
