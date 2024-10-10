"use client";
import React, {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import GridTableV1 from "../components/GridTable";
import {Container, CircularProgress} from "@mui/material";
import {InfoType, ProcessedInfoType} from "../interfaces";
import DonutAgesPage from "@/app/AdminDashboard/components/DonutAges";
import {Column} from "@/app/AdminDashboard/viewPage/interface/column.interface";
import {useAgeDonut} from "@/app/AdminDashboard/viewPage/hooks/useAgeDonut";

const ViewChartPage = () => {
  const [info, setInfo] = useState<InfoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = getCookie("token");
  const [columnsName2, setColumnsName2] = useState<Column[]>([]);
  const { canUse: canUseDonut } = useAgeDonut(columnsName2);

  // Efecto para crear las columnas dinámicas de la tabla
  useEffect(() => {
    if (!info || info.length <= 0) return;

    // Crear un conjunto de nombres de columnas basado en los datos disponibles
    const dynamicColumnsSet = new Set<string>();
    const quantity = Math.min(100, info.length)

    for (let i = 0; i < quantity; i++) {
      const item = info[i];
      item.info.forEach((infoItem) => {
        if (infoItem.label) {
          dynamicColumnsSet.add(infoItem.label);
        }
      });
    }
    const columns: Column[] = [
      ...Array.from(dynamicColumnsSet).map((name, index) => ({
        field: `info_${index}`,
        headerName: name,
        width: 250,
      })),
      {field: "siteName", headerName: "Nombre del Sitio:", width: 250},
      {field: "createdAt", headerName: "Fecha:", width: 250},
    ];
    setColumnsName2(columns);
  }, [info]);

  // Poner la informacion correcta en cada fila
  const processedInfo: ProcessedInfoType[] = info.map((item) => {
    const processedItem = columnsName2.reduce(
      (acc, columnName, index) => {
        const dataItem = item.info.find(
          (infoItem) => infoItem.label === columnName.headerName
        );
        acc[`info_${index}`] = dataItem ? dataItem.value : "";
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

  // Efecto para obtener los datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

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
        columns={columnsName2}
        lang={{}}
        getRowId={(row) => row._id}
      />
      {canUseDonut && <DonutAgesPage/>}
    </Container>
  );
};

export default ViewChartPage;