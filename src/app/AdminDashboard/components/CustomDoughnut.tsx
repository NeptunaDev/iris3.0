"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Stack, Typography } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomDoughnut = () => {
  const data = {
    labels: ["Medellin", "Rionegro"],
    datasets: [
      {
        label: "Poll",
        data: [3, 6, 5, 8, 2],
        backgroundColor: ["black", "red"],
      },
    ],
  };

  const options = {
    responsive: true,
  };

  return (
    <Stack sx = {{ width:'300px',  alignItems: "center", gap: 3}}>
      <Typography sx = {{fontWeight: "Bold", fontSize: "2rem"}}>Sedes:</Typography>
      <Doughnut data={data} options={options} />
    </Stack>
  );
};

export default CustomDoughnut;
