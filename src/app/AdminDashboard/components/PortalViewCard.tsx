"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, IconButton, Typography, CircularProgress } from '@mui/material';
import { FaEye } from 'react-icons/fa';
import { getCookie } from 'cookies-next';
import { PortalViewCardProps, PortalViewData } from '../interfaces';

const PortalViewCard: React.FC<PortalViewCardProps> = ({ dateRange }) => {
  const [viewPortal, setViewPortal] = useState<PortalViewData | null>(null);
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
        const response = await fetch(`/api/view?startDate=${startDateStr}&endDate=${endDateStr}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setViewPortal(result.data);
      } catch (error) {
        console.error("No se pudo consultar la vista", error);
        setError(error instanceof Error ? error.message : "Failed to fetch portal views");
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
      <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
        {isLoading && <CircularProgress />}
        {error && (
          <Typography color="error">
            Error: {error}
          </Typography>
        )}
        {!isLoading && !error && viewPortal && (
          <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            {viewPortal.length}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PortalViewCard;