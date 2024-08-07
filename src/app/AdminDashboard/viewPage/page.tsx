"use client";
import React, { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import GridTableV1 from '../components/GridTable';
import { Container } from '@mui/material';
import { InfoType, ProcessedInfoType } from '../interfaces';

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

  // Procesamos los datos para incluir solo las propiedades de `info`
  const processedInfo: ProcessedInfoType[] = info.map(item => {
    const processedItem = item.info.reduce((acc, curr, index) => {
      acc[`info_${index}`] = curr.value;
      return acc;
    }, { 
      _id: item._id,
      siteName: item.siteName,
      createdAt: item.createdAt,
    } as ProcessedInfoType);
    return processedItem;
  });

  const columnNames = ['Nombre:', 'Apellido:', 'Email:' ,'Rango de Edad:', 'Teléfono:', 'Profesión:'];
  
  // Definición de columnas para `info` más `siteName` y `createdAt`
  const columns = [
    ...columnNames.map((name, index) => ({
      field: `info_${index}`,
      headerName: name,
      width: 250
    })),
    { field: 'siteName', headerName: 'Nombre del Sitio:', width: 250 },
    { field: 'createdAt', headerName: 'Fecha:', width: 250 }
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
        title='Tabla De Registros del Portal'
        info={processedInfo}
        columns={columns}
        lang={{}}
        getRowId={(row) => row._id}
      />
    </Container>
  );
};

export default ViewChartPage;
