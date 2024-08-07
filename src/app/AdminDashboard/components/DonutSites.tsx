"use client";
import React, { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { Container } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';

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

const DonutSitestPage = () => {
  const [info, setInfo] = useState<InfoType[]>([]);
  const [chartData, setChartData] = useState<any>({});
  const token = getCookie("token");

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
    console.log("🚀 ~ usersBySite ~ usersBySite:", usersBySite)

    const data = {
      labels: Object.keys(usersBySite),
      datasets: [
        {
          label: '# of Users',
          data: Object.values(usersBySite),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
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