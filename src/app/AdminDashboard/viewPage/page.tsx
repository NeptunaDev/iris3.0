"use client";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import GridTableV1 from "../components/GridTable";
import { Container } from "@mui/material";
import { InfoType, ProcessedInfoType } from "../interfaces";

const ViewChartPage = () => {
  const [info, setInfo] = useState<InfoType[]>([]);
  const token = getCookie("token");
  const [columnsName2, setColumnsName2] = useState<string[]>([]);
  console.log("🚀 ~ ViewChartPage ~ columnsName2:", columnsName2)

  useEffect(() => {
    if (!info || info.length <= 0) return;

    // Crear un conjunto de nombres de columnas basado en los datos disponibles
    const dynamicColumnsSet = new Set<string>();

    info.forEach((item) => {
      item.info.forEach((infoItem) => {
        if (infoItem.label) {
          dynamicColumnsSet.add(infoItem.label); // Se pone si label no viene undefined, solo si pasa eso 
        }
      });
    });

    setColumnsName2(Array.from(dynamicColumnsSet));
  }, [info]);

  // Poner la informacion correcta en cada fila
  const processedInfo: ProcessedInfoType[] = info.map((item) => {
    const processedItem = columnsName2.reduce(
      (acc, columnName, index) => {
        const dataItem = item.info.find(
          (infoItem) => infoItem.label === columnName
        );
        acc[`info_${index}`] = dataItem ? dataItem.value : ""; // Poner vacio si no hay datos que mostrar en sexo u otra tabla
        return acc;
      },
      {
        _id: item._id,
        siteName: item.siteName,
        createdAt: item.createdAt,
      } as ProcessedInfoType
    );

    return processedItem;
  });

  // Definición dinámica de columnas para la tabla
  const columns = [
    ...columnsName2.map((name, index) => ({
      field: `info_${index}`,
      headerName: name,
      width: 250,
    })),
    { field: "siteName", headerName: "Nombre del Sitio:", width: 250 },
    { field: "createdAt", headerName: "Fecha:", width: 250 },
  ];

  // Efecto para obtener los datos desde la API
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
        title="Tabla De Registros del Portal"
        info={processedInfo}
        columns={columns}
        lang={{}}
        getRowId={(row) => row._id}
      />
    </Container>
  );
};

export default ViewChartPage;
