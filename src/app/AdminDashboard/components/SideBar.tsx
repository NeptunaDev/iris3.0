import { Box, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { FaChartLine, FaUser, FaWifi } from "react-icons/fa";
import { FaPersonCirclePlus } from "react-icons/fa6";
import { MdOutlineControlCamera, MdPlace } from "react-icons/md";
import { SiFormspree } from "react-icons/si";
import { TbReportSearch } from "react-icons/tb";

const iconSettings = {
  color: "white",
  fontSize: "20px"
};

const SideBar = () => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pb: "20px",
          backgroundColor: "#002567",
          mt: "20px",
          borderRadius: "15px"
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 200,
            color: "#C1C1C1",
            ml: "100px",
            pt: "20px"
          }}
        >
          MAIN
        </Typography>
        <Link href={""}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              borderRadius: "5px",
              "&:hover": {
                backgroundColor: "#384256"
              }
            }}
          >
            <FaChartLine style={iconSettings} />
            <Typography sx={{ color: "white", textDecoration: "none" }}>
              Admin Dashboard
            </Typography>
          </Box>
        </Link>
        <hr
          style={{
            border: "0",
            borderBottom: "1px solid #384256",
            margin: "0 20px"
          }}
        />
        <Link href={""}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              "&:hover": {
                backgroundColor: "#384256"
              }
            }}
          >
            <SiFormspree style={iconSettings} />
            <Typography sx={{ color: "white" }}>Portal Cautivo</Typography>
          </Box>
        </Link>
        <hr
          style={{
            border: "0",
            borderBottom: "1px solid #384256",
            margin: "0 20px"
          }}
        />
        <Link href={""}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              "&:hover": {
                backgroundColor: "#384256"
              }
            }}
          >
            <MdOutlineControlCamera style={iconSettings} />
            <Typography sx={{ color: "white" }}>Controladores</Typography>
          </Box>
        </Link>
        <hr
          style={{
            border: "0",
            borderBottom: "1px solid #384256",
            margin: "0 20px"
          }}
        />
        <Link href={""}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              "&:hover": {
                backgroundColor: "#384256"
              }
            }}
          >
            <FaPersonCirclePlus style={iconSettings} />
            <Typography sx={{ color: "white" }}>Clientes</Typography>
          </Box>
        </Link>
        <hr
          style={{
            border: "0",
            borderBottom: "1px solid #384256",
            margin: "0 20px"
          }}
        />
        <Link href={""}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              "&:hover": {
                backgroundColor: "#384256"
              }
            }}
          >
            <TbReportSearch style={iconSettings} />
            <Typography sx={{ color: "white" }}>Reportes</Typography>
          </Box>
        </Link>
        <hr
          style={{
            border: "0",
            borderBottom: "1px solid #384256",
            margin: "0 20px"
          }}
        />
        <Link href={""}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              "&:hover": {
                backgroundColor: "#384256"
              }
            }}
          >
            <FaWifi style={iconSettings} />
            <Typography sx={{ color: "white" }}>Wifi</Typography>
          </Box>
        </Link>
        <hr
          style={{
            border: "0",
            borderBottom: "1px solid #384256",
            margin: "0 20px"
          }}
        />
        <Link href={""}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              "&:hover": {
                backgroundColor: "#384256"
              }
            }}
          >
            <FaUser style={iconSettings} />
            <Typography sx={{ color: "white" }}>Usuarios</Typography>
          </Box>
        </Link>
        <hr
          style={{
            border: "0",
            borderBottom: "1px solid #384256",
            margin: "0 20px"
          }}
        />
        <Link href={""}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              "&:hover": {
                backgroundColor: "#384256"
              }
            }}
          >
            <MdPlace style={iconSettings} />
            <Typography sx={{ color: "white" }}>Lugares</Typography>
          </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default SideBar;
