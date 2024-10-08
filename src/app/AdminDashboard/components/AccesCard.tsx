"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, IconButton, Typography, CircularProgress } from "@mui/material";
import { AiOutlineLogin } from "react-icons/ai";
import { getCookie } from "cookies-next";

interface AccessData {
  length: number;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface AccesCardProps {
  dateRange: DateRange;
}

const AccesCard: React.FC<AccesCardProps> = ({ dateRange }) => {
  const [accessGrate, setAccessGrate] = useState<AccessData | null>(null);
  console.log("🚀 ~ accessGrate:", accessGrate)
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