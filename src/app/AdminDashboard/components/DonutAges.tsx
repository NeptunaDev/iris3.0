"use client";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { Container } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { InfoType } from "../interfaces";

ChartJS.register(ArcElement, Tooltip, Legend);

const generateColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
};

const DonutAgesPage = () => {
  const [info, setInfo] = useState<InfoType[]>([]);
  const [chartData, setChartData] = useState<any>({});
  const token = getCookie("token");
  generateColor();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/view?isLogin=${true}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const result = await response.json();
        setInfo(result.data);
      } catch (error) {
        console.log(error, "No se pudo consultar la vista");
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (!info || info.length <= 0) return;

    const ageCounts = info.reduce(
      (acc: { [key: string]: number }, curr: InfoType) => {
        const edad = curr.info.find((item) => item.label === "Edad");
        if (edad) {
          return {
            ...acc,
            [edad.value]: (acc[edad.value] || 0) + 1,
          };
        }
        return acc;
      },
      {} as { [key: string]: number }
    );

    const data2 = {
      labels: Object.keys(ageCounts),
      datasets: [
        {
          label: "Número por Rango de Edades",
          data: Object.values(ageCounts),
          backgroundColor: Object.values(ageCounts).map(() => generateColor()),
          hoverOffset: 4,
        },
      ],
    };

    setChartData(data2);
  }, [info]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Users by Site",
      },
    },
  };

  if (!chartData || !chartData?.labels) return;

  return (
    <Container
      sx={{
        backgroundColor: "white",
        borderRadius: "20px",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        height: "400px",
        width: "400px",
      }}
    >
      <Doughnut data={chartData} options={options} />
    </Container>
  );
};

export default DonutAgesPage;