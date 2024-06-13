"use client";
import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { Card, CardHeader, CardContent, IconButton, Typography } from '@mui/material';
import { FaEye } from 'react-icons/fa';
import { getCookie } from 'cookies-next';

interface MyJwtPayload {
  id: string;
  name: string;
  iat: number;
  exp: number;
}

const PortalViewCard = () => {
  const [viewPortal, setViewPortal] = useState([]);
  const token = getCookie("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof token === "string") {
          const decoded = jwtDecode<MyJwtPayload>(token);

          const { id } = decoded;

          const url = `/api/controller?idClient=${id}`;
          const response1 = await fetch(url);

          if (!response1.ok) {
            throw new Error("Network response was not ok");
          }

          const data1 = await response1.json();
          const idToSend = data1.data[0]._id;

          const url2 = `/api/view?idController=${idToSend}`;
          const response2 = await fetch(url2);

          if (!response2.ok) {
            throw new Error("Network response was not ok");
          }

          const data2 = await response2.json();
          console.log("Datos recibidos del segundo endpoint:", data2);
          setViewPortal(data2.data);
        }
      } catch (error) {
        console.error("Hubo un problema con la petición fetch:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Card sx={{ maxWidth: 345, borderRadius: "16px", boxShadow: 3 }}>
      <CardHeader
        avatar={
          <IconButton aria-label="views">
            <FaEye />
          </IconButton>
        }
        title={
          <Typography variant="h6" component="div">
            Vistas del Portal:
          </Typography>
        }
      />
      <CardContent sx = {{display: "flex", justifyContent: "center"}}>
        <Typography sx = {{fontWeight: "bold", fontSize: "1.5rem" }}>
        {viewPortal.length}
      </Typography>
      </CardContent>
    </Card>
  );
};

export default PortalViewCard;
