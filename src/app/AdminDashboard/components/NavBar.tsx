import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const iconStyle = {
  color: "black",
  fontSize: "20px"
};

const iconNoti = {
  color: "black",
  fontSize: "25px"
};

const iconSettings = {
  color: "black",
  fontSize: "20px",
  paddingRight: "10px"
};

const NavBar = () => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "80px"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", color: "black" }}>
          logo
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <FaSearch style={iconStyle} />
          <IoIosNotifications style={iconNoti} />
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaUser style={iconStyle} />
            <Typography sx={{ color: "black" }}>Netmask</Typography>
          </Box>
          <IoMdSettings style={iconSettings} />
        </Box>
      </Box>
      <Divider
        sx={{ backgroundColor: "#C1C1C1", width: "100%", height: "1px" }}
      />
    </>
  );
};

export default NavBar;
