"use client";
import React, { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import GridTableV1 from '../components/GridTable';
import { Container } from '@mui/material';

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

interface ProcessedInfoType {
  _id: string;
  [key: string]: any;
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

  // Procesamos los datos para incluir solo las propiedades de `info`
  const processedInfo: ProcessedInfoType[] = info.map(item => {
    return item.info.reduce((acc, curr, index) => {
      acc[`info_${index}`] = curr.value;
      return acc;
    }, { _id: item._id } as ProcessedInfoType);
  });

  const columnNames = ['Nombre:', 'Apellido:', 'Email:', 'Rango de Edad:', 'Teléfono:', 'Profesión'];
  //limpiar base de datos, verificar campos de formulario si envien esa informacion, y los normbres de la columna cargarlos dinamicamente

  // Definición de columnas solo para `info`
  const columns = columnNames.map((name, index) => ({
    field: `info_${index}`,
    headerName: name,
    width: 250
  }));

  useEffect(() => {
    if(!info || info.length <= 0) return
    const usersBySite = info.reduce((acc: { [key: string]: number }, curr: InfoType) => {
      return {
        ...acc,
        [curr.siteName]: (acc[curr.siteName] || 0) + 1,
      };
    }, {} as { [key: string]: number });
    console.log(usersBySite);
  }, [info]);

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