"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, IconButton, Typography, CircularProgress } from "@mui/material";
import { AiOutlineLogin } from "react-icons/ai";
import { getCookie } from "cookies-next";
import { PortalViewCardProps, PortalViewData } from "../interfaces";

interface AccessData {
  length: number;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const AccesCard: React.FC<PortalViewCardProps> = ({ dateRange }) => {
  const [accessGrate, setAccessGrate] = useState<PortalViewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie("token") as string;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      if (!dateRange.startDate || !dateRange.endDate) {
        setError("Please select both start and end dates");
        setIsLoading(false);
        return;
      }

      const startDateStr = dateRange.startDate.format('MM/DD/YYYY');
      const endDateStr = dateRange.endDate.format('MM/DD/YYYY');
        try {
          const response = await fetch(`/api/view?isLogin=true&startDate=${startDateStr}&endDate=${endDateStr}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          const result = await response.json();
          setAccessGrate(result.data);
        } catch (error) {
          console.error("No se pudo consultar la vista", error);
          setError("Failed to fetch access data");
        } finally {
          setIsLoading(false);
        }
    };

    fetchData();
  }, [dateRange, token]);

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
      <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
        {isLoading && <CircularProgress />}
        {error && (
          <Typography color="error">
            Error: {error}
          </Typography>
        )}
        {!isLoading && !error && accessGrate && (
          <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            {accessGrate.length}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AccesCard;