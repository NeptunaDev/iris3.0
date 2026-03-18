"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { PortalViewCardProps } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { useViewRepository } from "@/lib/View/infrastructure/hooks/useViewRepository";
import { createViewService } from "@/lib/View/application/ViewService";
import StatCard from "./StatCard";

const AccesCard: React.FC<PortalViewCardProps> = ({ dateRange }) => {
  const repository = useViewRepository();
  const service = createViewService(repository);
  const [accessGrate, setAccessGrate] = useState<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["portal-access", dateRange.endDate, dateRange.startDate],
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
      }),
  });

  useEffect(() => {
    if (!data || !data.data || typeof data.data !== "number") {
      return;
    }
    setAccessGrate(data.data);
  }, [data]);

  return (
    <StatCard
      title="Conexiones hechas"
      subtitle="Usuarios que completaron el portal"
      icon={<AiOutlineLogin />}
      value={accessGrate}
      loading={isLoading}
      error={error ? error.message : undefined}
    />
  );
};

export default AccesCard;