"use client";
import React, { useState } from "react";
import { Box, Stack, CssBaseline, Container, Typography } from "@mui/material";
import AccesCard from "./components/AccesCard";
import PortalViewCard from "./components/PortalViewCard";
import UniqueDevicesCard from "./components/UniqueDevicesCard";
import DonutSitestPage from "./components/DonutSites";
import DonutAgesPage from "./components/DonutAges";
import { CustomDatePicker } from "./components/CustomDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { DateRange } from "./interfaces";

const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: dayjs().subtract(30, "day"),
    endDate: dayjs(),
  });

  const handleStartDateChange = (date: Dayjs | null) => {
    setDateRange((prev) => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setDateRange((prev) => ({ ...prev, endDate: date }));
  };

  return (
    <Container
      sx={{
        backgroundColor: "white",
        borderRadius: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CssBaseline />
      <Stack
        sx={{ justifyContent: "center", alignItems: "center", pb: "2rem" }}
      >
        <Typography sx={{ fontWeight: "Bold", fontSize: "2rem" }}>
          Datos Sobre el Portal:
        </Typography>
        <Box sx={{ mb: 1.5, mt: 1.5 }}>
          <CustomDatePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </Box>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent={"space-between"}
          width={"100%"}
          gap={2}
        >
          <PortalViewCard dateRange={dateRange} />
          <AccesCard dateRange={dateRange} />
          <UniqueDevicesCard dateRange={dateRange} />
        </Stack>
      </Stack>
      <Stack sx={{ mt: "2rem", flexDirection: "row" }}>
        <DonutSitestPage />
        {/*<DonutAgesPage />*/}
      </Stack>
    </Container>
  );
};

export default AdminDashboard;
