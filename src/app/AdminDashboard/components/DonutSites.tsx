"use client";
import React, { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { Container } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface InfoItem {
  value: string; // Ajusta esto según la estructura real de los elementos dentro de 'info'
}

interface InfoType {
  createdAt: string;
  idAp: string;
  info: InfoItem[];
  isLogin: boolean;
  mac: string;
  updatedAt: string;
  __v: number;
  _id: string;
  siteName: string
  siteId: string;
}

const generateColor = () => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r},${g},${b})`;
}

const DonutSitestPage = () => {
  const [info, setInfo] = useState<InfoType[]>([]);
  const [chartData, setChartData] = useState<any>({});
  const token = getCookie("token");
  generateColor()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/view?isLogin=${true}`, {
          method: "GET",
          headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log("🚀 ~ fetchData ~ response:", response)
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

    const usersBySite = info.reduce((acc: { [key: string]: number }, curr: InfoType) => {
      return {
        ...acc,
        [curr.siteName]: (acc[curr.siteName] || 0) + 1,
      };
    }, {} as { [key: string]: number });
    console.log(usersBySite)

    const data2 = {
      labels: Object.keys(usersBySite),
      datasets: [{
        label: 'My First Dataset',
        data: Object.values(usersBySite),
        backgroundColor: Object.values(usersBySite).map(() => generateColor()),
        hoverOffset: 4
      }]
    };

    setChartData(data2);
  }, [info]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Users by Site',
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
        padding: '20px',
        height: '400px',
        width: '400px'
      }}
    >
      <Doughnut data={chartData} options={options} />
    </Container>
  );
};

export default DonutSitestPage;