"use client";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

// Definición de tipos para las props
interface GridTableV1Props {
  info: Array<{ [key: string]: any }>;
  columns: GridColDef[];
  title: string;
  lang: {
    [key: string]: string;
  };
  getRowId: (row: any) => string;
}

const GridTableV1 = (props: GridTableV1Props) => {
  const { info, columns, title, lang, getRowId } = props;
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          fontWeight: "bold",
          fontSize: "20px",
          alignItems: "center",
          paddingBottom: "1rem",
          paddingTop: "1rem",
          justifyContent: "center",
        }}
      >
        <h1>{title}</h1>
      </Box>
      <Box
        className="dashboard-content"
        sx={{
          paddingBottom: "0.8rem",
          paddingRight: "1rem",
          paddingLeft: "1rem",
        }}
      >
        <DataGrid
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={info}
          columns={columns}
          pageSizeOptions={[15]}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          rowHeight={35}
          sx={{ justifyContent: "center", width: "100%" }}
          getRowId={getRowId}
        />
      </Box>
    </>
  );
};

export default GridTableV1;
