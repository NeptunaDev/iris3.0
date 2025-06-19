"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, IconButton, Typography, CircularProgress } from '@mui/material';
import { FaEye } from 'react-icons/fa';
import { PortalViewCardProps } from '../interfaces';
import { useQuery } from '@tanstack/react-query';
import { createViewService } from '@/lib/View/application/ViewService';
import { useViewRepository } from '@/lib/View/infrastructure/hooks/useViewRepository';

const PortalViewCard: React.FC<PortalViewCardProps> = ({ dateRange }) => {
  const repository = useViewRepository();
  const service = createViewService(repository);
  const [viewPortal, setViewPortal] = useState<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["portal-views", dateRange.endDate, dateRange.startDate],
    queryFn: () => service.find({
      ...(dateRange.endDate && { createdAtEndDate: dateRange.endDate.format('MM/DD/YYYY') }),
      ...(dateRange.startDate && { createdAtStartDate: dateRange.startDate.format('MM/DD/YYYY') }),
      onlyCount: true,
    })
  })

  useEffect(() => {
    if (!data || !data.data || typeof data.data !== 'number') {
      return;
    }
    setViewPortal(data.data);
  }, [data]);

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
            Error: {error.message}
          </Typography>
        )}
        {!isLoading && !error && viewPortal && (
          <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            {viewPortal}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PortalViewCard;