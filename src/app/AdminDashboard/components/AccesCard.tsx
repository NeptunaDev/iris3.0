"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, IconButton, Typography, CircularProgress } from "@mui/material";
import { AiOutlineLogin } from "react-icons/ai";
import { getCookie } from "cookies-next";
import { PortalViewCardProps, PortalViewData } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { useViewRepository } from "@/lib/View/infrastructure/hooks/useViewRepository";
import { createViewService } from "@/lib/View/application/ViewService";

interface AccessData {
  length: number;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const AccesCard: React.FC<PortalViewCardProps> = ({ dateRange }) => {
  const repository = useViewRepository();
  const service = createViewService(repository);
  const [accessGrate, setAccessGrate] = useState<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["portal-access", dateRange.endDate, dateRange.startDate],
    queryFn: () => service.find({
      ...(dateRange.endDate && { createdAtEndDate: dateRange.endDate.format('MM/DD/YYYY') }),
      ...(dateRange.startDate && { createdAtStartDate: dateRange.startDate.format('MM/DD/YYYY') }),
      onlyCount: true,
      isLogin: true,
    })
  })

  useEffect(() => {
    if (!data || !data.data || typeof data.data !== 'number') {
      return;
    }
    setAccessGrate(data.data);
  }, [data]);

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
            Error: {error.message}
          </Typography>
        )}
        {!isLoading && !error && accessGrate && (
          <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            {accessGrate}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AccesCard;