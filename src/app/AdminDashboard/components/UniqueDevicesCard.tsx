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
import { useViewRepository } from "@/lib/View/infrastructure/hooks/useViewRepository";
import { createViewService } from "@/lib/View/application/ViewService";
import { useQuery } from "@tanstack/react-query";

const UniqueDevicesCard: React.FC<PortalViewCardProps> = ({ dateRange }) => {
  const repository = useViewRepository();
  const service = createViewService(repository);
  const [uniqueDevices, setUniqueDevices] = useState<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["portal-unique-devices", dateRange.endDate, dateRange.startDate],
    queryFn: () => service.find({
      ...(dateRange.endDate && { createdAtEndDate: dateRange.endDate.format('MM/DD/YYYY') }),
      ...(dateRange.startDate && { createdAtStartDate: dateRange.startDate.format('MM/DD/YYYY') }),
      onlyCount: true,
      isLogin: true,
      distinct: "mac",
    })
  })

  useEffect(() => {
    if (!data || !data.data || typeof data.data !== 'number') {
      return;
    }
    setUniqueDevices(data.data);
  }, [data]);

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
            Error: {error.message}
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