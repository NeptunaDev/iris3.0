"use client";
import { getCookie } from "cookies-next";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import { AiOutlineLogin } from "react-icons/ai";

const AccesCard = () => {
  const [accessGrate, setAccessGrate] = useState([])
  const token = getCookie("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/view?isLogin=${true}` ,{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const result = await response.json();
        setAccessGrate(result.data)
      } catch (error) {
        console.log(error, "No se pudo consultar la vista")
      }
    };

    fetchData();
  }, [token]);

  return (
    <Card sx={{ maxWidth: 345, borderRadius: '16px', boxShadow: 3 }}>
    <CardHeader
      avatar={
        <IconButton aria-label="conections">
          <AiOutlineLogin />
        </IconButton>
      }
      title={
        <Typography variant="h6" component="div">
          Conexiones Hechas:
        </Typography>
      }
    />
    <CardContent sx = {{display: "flex", justifyContent: "center"}}>
      <Typography sx = {{fontWeight: "bold", fontSize: "1.5rem" }}>
        {accessGrate.length}
      </Typography>
    </CardContent>
  </Card>
  );
};

export default AccesCard;
