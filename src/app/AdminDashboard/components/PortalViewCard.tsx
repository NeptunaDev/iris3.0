"use client";
import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { PortalViewCardProps } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { createViewService } from "@/lib/View/application/ViewService";
import { useViewRepository } from "@/lib/View/infrastructure/hooks/useViewRepository";
import StatCard from "./StatCard";

const PortalViewCard: React.FC<PortalViewCardProps> = ({ dateRange }) => {
  const repository = useViewRepository();
  const service = createViewService(repository);
  const [viewPortal, setViewPortal] = useState<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["portal-views", dateRange.endDate, dateRange.startDate],
    queryFn: () =>
      service.find({
        ...(dateRange.endDate && {
          createdAtEndDate: dateRange.endDate.format("MM/DD/YYYY"),
        }),
        ...(dateRange.startDate && {
          createdAtStartDate: dateRange.startDate.format("MM/DD/YYYY"),
        }),
        onlyCount: true,
      }),
  });

  useEffect(() => {
    if (!data || !data.data || typeof data.data !== "number") {
      return;
    }
    setViewPortal(data.data);
  }, [data]);

  return (
    <StatCard
      title="Vistas del portal"
      subtitle="Total de veces que se mostró el portal"
      icon={<FaEye />}
      value={viewPortal}
      loading={isLoading}
      error={error ? error.message : undefined}
    />
  );
};

export default PortalViewCard;