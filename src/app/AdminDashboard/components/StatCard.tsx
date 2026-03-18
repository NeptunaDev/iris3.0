"use client";

import { Card, CardContent, CardHeader, Stack, Typography, Box, CircularProgress } from "@mui/material";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value?: number | string;
  subtitle?: string;
  icon: ReactNode;
  accentColor?: string;
  loading?: boolean;
  error?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = "#1976d2",
  loading,
  error,
}) => {
  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 260,
        borderRadius: "20px",
        boxShadow: 3,
        bgcolor: "#fff",
      }}
    >
      <CardHeader
        sx={{ pb: 0 }}
        title={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: accentColor,
                color: "#fff",
                fontSize: "1.2rem",
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
                color="text.secondary"
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.disabled">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>
        }
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 1,
            minHeight: 64,
          }}
        >
          {loading && (
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <CircularProgress size={28} />
            </Box>
          )}
          {!loading && error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          {!loading && !error && (
            <Typography
              sx={{ fontWeight: 700, fontSize: "2rem", textAlign: "center" }}
              color="text.primary"
            >
              {value ?? "—"}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;

