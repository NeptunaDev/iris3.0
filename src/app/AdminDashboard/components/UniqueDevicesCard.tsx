"use client";
import React, { useState, useEffect } from "react";
import { FiMonitor } from "react-icons/fi";
import { PortalViewCardProps } from "../interfaces";
import { useViewRepository } from "@/lib/View/infrastructure/hooks/useViewRepository";
import { createViewService } from "@/lib/View/application/ViewService";
import { useQuery } from "@tanstack/react-query";
import StatCard from "./StatCard";

const UniqueDevicesCard: React.FC<PortalViewCardProps> = ({ dateRange }) => {
  const repository = useViewRepository();
  const service = createViewService(repository);
  const [uniqueDevices, setUniqueDevices] = useState<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["portal-unique-devices", dateRange.endDate, dateRange.startDate],
    queryFn: () =>
      service.find({
        ...(dateRange.endDate && {
          createdAtEndDate: dateRange.endDate.format("MM/DD/YYYY"),
        }),
        ...(dateRange.startDate && {
          createdAtStartDate: dateRange.startDate.format("MM/DD/YYYY"),
        }),
        onlyCount: true,
        isLogin: true,
        distinct: "mac",
      }),
  });

  useEffect(() => {
    if (!data || !data.data || typeof data.data !== "number") {
      return;
    }
    setUniqueDevices(data.data);
  }, [data]);

  return (
    <StatCard
      title="Dispositivos únicos"
      subtitle="Número de clientes distintos que se conectaron"
      icon={<FiMonitor />}
      value={uniqueDevices}
      loading={isLoading}
      error={error ? error.message : undefined}
    />
  );
};

export default UniqueDevicesCard;