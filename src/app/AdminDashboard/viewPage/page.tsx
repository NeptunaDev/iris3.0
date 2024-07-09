"use client";
import React, { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import GridTableV1 from '../components/GridTable';
import { Container } from '@mui/material';

interface InfoType {
  createdAt: string;
  idAp: string;
  info: Array<{ [key: string]: any }>;
  isLogin: boolean;
  mac: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

const ViewChartPage = () => {
  const [info, setInfo] = useState<InfoType[]>([]);
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

  const columns = [
    { field: 'createdAt', headerName: 'Created At', width: 150 },
    { field: 'idAp', headerName: 'ID AP', width: 150 },
    { field: 'isLogin', headerName: 'Is Login', width: 100 },
    { field: 'mac', headerName: 'MAC Address', width: 150 },
    { field: 'updatedAt', headerName: 'Updated At', width: 150 },
    { field: '__v', headerName: 'Version', width: 100 },
    { field: '_id', headerName: 'ID', width: 150 },
    // Agregar columnas para cada clave en 'info' si es necesario
  ];

  return (
    <Container
      sx={{
        backgroundColor: "white",
        borderRadius: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GridTableV1
        title='Hola'
        info={info}
        columns={columns}
        lang={{}}
        getRowId={(row) => row._id}
      />
    </Container>
  );
};

export default ViewChartPage;
