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
    if (typeof token === "string") {
      const decoded = jwtDecode<MyJwtPayload>(token);

      const { id } = decoded;

      const url = `/api/controller?idClient=${id}`;

      // Realizar la solicitud fetch
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(async (data) => {
          const idToSend = data.data[0]._id;

          // Realizar la segunda solicitud fetch usando idToSend
          const url2 = `/api/view/unique-devices?idController=${idToSend}`;

          const response = await fetch(url2);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data_1 = await response.json();
          setUniqueDevices(data_1.data);
        })
        .catch((error) => {
          console.error("Hubo un problema con la petición fetch:", error);
        });
    }
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
            Dispositivos unicos:
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
