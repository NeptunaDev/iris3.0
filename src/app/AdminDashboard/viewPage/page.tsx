"use client";
import React, {useEffect, useState} from 'react';
import {getCookie} from 'cookies-next';
import GridTableV1 from '../components/GridTable';
import {Container} from '@mui/material';
import {InfoType, ProcessedInfoType} from '../interfaces';

const ViewChartPage = () => {
  const [info, setInfo] = useState<InfoType[]>([]);
  const token = getCookie("token");
  const [columnsName2, setColumnsName2] = useState<string[]>([])

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

  // Definición de columnas para `info` más `siteName` y `createdAt`
  const columns = [
    ...columnsName2.map((name, index) => ({
      field: `info_${index}`,
      headerName: name,
      width: 250
    })),
    {field: 'siteName', headerName: 'Nombre del Sitio:', width: 250},
    {field: 'createdAt', headerName: 'Fecha:', width: 250}
  ];

  useEffect(() => {
    if (!info || info.length <= 0) return
    const quantity = Math.min(info.length, 99)

    for (let i = 0; i < quantity; i++) {
      const {info: infoView} = info[i]
      for (const item of infoView) {
        const {label} = item
        if (!label) continue
        setColumnsName2((prev) => {
          if (prev.includes(label)) return prev
          return [...prev, label]
        })
      }
    }

  }, [info]);

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
