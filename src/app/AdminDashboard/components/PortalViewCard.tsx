"use client";
import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { Card, CardHeader, CardContent, IconButton, Typography } from '@mui/material';
import { FaEye } from 'react-icons/fa';
import { getCookie } from 'cookies-next';

const PortalViewCard = () => {
  const [viewPortal, setViewPortal] = useState([]);
  const token = getCookie("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/view` ,{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const result = await response.json();
        setViewPortal(result.data)
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
