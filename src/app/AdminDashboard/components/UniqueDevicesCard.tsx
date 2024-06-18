"use client";
import { getCookie } from "cookies-next";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { FiMonitor } from "react-icons/fi";

interface MyJwtPayload {
  id: string;
  name: string;
  iat: number;
  exp: number;
}

const UniqueDevicesCard = () => {
  const [uniqueDevices, setUniqueDevices] = useState();
  const token = getCookie("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/view/unique-devices` ,{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const result = await response.json();
        setUniqueDevices(result.data)
      } catch (error) {
        console.log(error, "No se pudo consultar la vista")
      }
    };

    fetchData();
  }, [token]);

  return (
    <Card sx={{ maxWidth: 345, borderRadius: "16px", boxShadow: 3 }}>
      <CardHeader
        avatar={
          <IconButton aria-label="unique devices">
            <FiMonitor />
          </IconButton>
        }
        title={
          <Typography variant="h6" component="div">
            Dispositivos Unicos:
          </Typography>
        }
      />
      <CardContent sx={{ display: "flex", justifyContent: "center" }}>
        <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>{uniqueDevices}</Typography>
      </CardContent>
    </Card>
  );
};

export default UniqueDevicesCard;
