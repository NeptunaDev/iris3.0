"use client";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FiMonitor } from "react-icons/fi";

interface UniqueDevicesData {
  count: number;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface UniqueDevicesCardProps {
  dateRange: DateRange;
}

const UniqueDevicesCard: React.FC<UniqueDevicesCardProps> = ({ dateRange }) => {
  const [uniqueDevices, setUniqueDevices] = useState<UniqueDevicesData | null>(null);
  console.log("🚀 ~ uniqueDevices:", uniqueDevices)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie("token") as string;

  useEffect(() => {
    const fetchData = async () => {
      if (dateRange.startDate && dateRange.endDate) {
        setIsLoading(true);
        setError(null);
        const startDateStr = dateRange.startDate.toISOString().split('T')[0];
        const endDateStr = dateRange.endDate.toISOString().split('T')[0];
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
            {uniqueDevices.count}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default UniqueDevicesCard;