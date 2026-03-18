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
    <Box
      sx={{
        py: 4,
        px: { xs: 2, md: 4 },
        bgcolor: "#fff",
        width: "100%",
      }}
    >
      <CssBaseline />
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1.8rem" }}>
                Datos sobre el portal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analiza el rendimiento de tu portal cautivo en el rango de
                fechas seleccionado.
              </Typography>
            </Box>
            <Box>
              <CustomDatePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
              />
            </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ mt: 1 }}
          >
            <PortalViewCard dateRange={dateRange} />
            <AccesCard dateRange={dateRange} />
            <UniqueDevicesCard dateRange={dateRange} />
          </Stack>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <Box
              sx={{
                flex: 1,
                bgcolor: "#fff",
                borderRadius: "20px",
                boxShadow: 3,
                p: 2,
                minHeight: 360,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 1.5, fontWeight: 600 }}
              >
                Distribución de usuarios por sitio
              </Typography>
              <DonutSitestPage />
            </Box>
            {/* Aquí más adelante se puede añadir otra tarjeta analítica (por ejemplo, tendencias de conexiones) */}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
