"use client";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FiMonitor } from "react-icons/fi";
import { PortalViewCardProps } from "../interfaces";

const UniqueDevicesCard: React.FC<PortalViewCardProps> = ({ dateRange }) => {
  const [uniqueDevices, setUniqueDevices] = useState<number | null>(null);
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
          const response = await fetch(`/api/view/unique-devices?startDate=${startDateStr}&endDate=${endDateStr}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          const result = await response.json();
          setUniqueDevices(result.data);
        } catch (error) {
          console.error("No se pudo consultar la vista de dispositivos únicos", error);
          setError("Failed to fetch unique devices data");
        } finally {
          setIsLoading(false);
        }
    };

    fetchData();
  }, [dateRange, token]);

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
            Dispositivos Únicos:
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
        {!isLoading && !error && uniqueDevices && (
          <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            {uniqueDevices}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default UniqueDevicesCard;