import React from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar";
import { Box } from "@mui/material";

const Layout = () => {
  return (
    <Box>
      <NavBar />
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            width: "250px"
          }}
        >
          <SideBar />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
