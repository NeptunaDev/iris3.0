// "use client";
// import React, { useEffect, useState } from "react";
// import { JwtPayload, jwtDecode } from "jwt-decode";
// import { getCookie } from "cookies-next";
// import {
//   Grid,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   CssBaseline,
//   Stack,
// } from "@mui/material";
// import BasicTable from "../components/TableList";

// interface PersonalToken extends JwtPayload {
//   id: string;
// }

//  export interface Controller {
//   _id: string;
//   ap: string;
//   site: string;
// }

// const ControllerCrud: React.FC = () => {
//   const token = getCookie("token");
//   let idClient: string | undefined;
//   const [ap, setAp] = useState("");
//   const [site, setSite] = useState("");
//   const [controllers, setControllers] = useState<Controller[]>([]);

//   if (token) {
//     const decodedToken = jwtDecode<PersonalToken>(token);
//     idClient = decodedToken.id;
//   }

//   const handleCreate = async () => {
//     if (idClient) {
//       const body = {
//         idClient: idClient,
//         ap: ap,
//         site: site,
//       };
//       const JSONdata = JSON.stringify(body);
//       try {
//         const response = await fetch("/api/controller", {
//           body: JSONdata,
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("🚀 ~ handleCreate ~ response:", response);
//         if (response.ok) {
//           const data = await response.json();
//           console.log("🚀 ~ handleCreate ~ data:", data.data);
//           setControllers([...controllers, data.data]);
//           setAp("");
//           setSite("");
//         }
//       } catch (error) {
//         console.log("Error en la solicitud:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/controller?idClient=${idClient}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("🚀 ~ fetchData ~ response:", response);
//         if (response.ok) {
//           const data = await response.json();
//           setControllers(data.data);
//         }
//       } catch (error) {
//         console.log("Error en la solicitud:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleDelete = async (id: string) => {
//     const body = {
//       id 
//     };
//     const JSONdata = JSON.stringify(body);
//     try {
//       const response = await fetch("/api/controller", {
//         body: JSONdata,
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("🚀 ~ handleDelete ~ response:", response)
//       if (response.ok) {
//          setControllers((prev) => (
//           prev.filter((controller) => controller._id !== id)
//          ))
//       }
//     } catch (error) {
//       console.log("Error en la solicitud:", error);
//     }
//   };

//   return (
//     <Stack
//       sx={{
//         minHeight: "100vh",
//         width: "100%"
//       }}
//       justifyContent={"center"}
//       alignItems={"center"}
//     >
//       <Grid container justifyContent="center">
//         <Grid item xs={12} sm={8} md={6}>
//           <Paper elevation={3} sx={{ padding: 3 }}>
//             <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
//               Create Controller
//             </Typography>
//             <TextField
//               label="AP"
//               fullWidth
//               value={ap}
//               onChange={(e) => setAp(e.target.value)}
//               sx={{ marginBottom: 2 }}
//             />
//             <TextField
//               label="Site"
//               fullWidth
//               value={site}
//               onChange={(e) => setSite(e.target.value)}
//               sx={{ marginBottom: 2 }}
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleCreate}
//               sx={{ marginRight: 2 }}
//             >
//               Create
//             </Button>
//           </Paper>
//           <Typography variant="h5" sx={{ marginTop: 3 }}>
//             Controllers
//           </Typography>
//           <BasicTable data={controllers} onDelete={handleDelete} />
//         </Grid>
//       </Grid>
//     </Stack>
//   );
// };

// export default ControllerCrud;
"use client"
// src/App.tsx
import React, { useState } from 'react';
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CreateUpdateModal from './components/CreateUpdateModal';
import DeleteConfirmation from './components/DeleteConfirmation';

interface DataItem {
  id: number;
  field1: string;
  field2: string;
}

const initialData: DataItem[] = [
  { id: 1, field1: 'Dato 1', field2: 'Dato 2' },
  { id: 2, field1: 'Dato 3', field2: 'Dato 4' },
];

const ControllerCrud: React.FC = () => {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentData, setCurrentData] = useState<DataItem>({ id: 0, field1: '', field2: '' });
  const [isUpdate, setIsUpdate] = useState(false);

  const handleOpenCreate = () => {
    setCurrentData({ id: 0, field1: '', field2: '' });
    setIsUpdate(false);
    setModalOpen(true);
  };

  const handleOpenUpdate = (item: DataItem) => {
    setCurrentData(item);
    setIsUpdate(true);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleCloseDelete = () => setDeleteOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isUpdate) {
      setData((prev) =>
        prev.map((item) => (item.id === currentData.id ? currentData : item))
      );
    } else {
      setData((prev) => [
        ...prev,
        { ...currentData, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((item) => item.id !== currentData.id));
    setDeleteOpen(false);
  };

  const handleOpenDelete = (item: DataItem) => {
    setCurrentData(item);
    setDeleteOpen(true);
  };

  return (
    <Container sx = {{backgroundColor: '#fff', borderRadius: "20px",}}>
      <h1>Crea Proyectos</h1>
      <Button variant="contained" color="primary" onClick={handleOpenCreate}>
        Crear
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Campo 1</TableCell>
              <TableCell>Campo 2</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.field1}</TableCell>
                <TableCell>{item.field2}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenUpdate(item)}
                    sx={{ mr: 1 }}
                  >
                    Actualizar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleOpenDelete(item)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateUpdateModal
        open={modalOpen}
        handleClose={handleCloseModal}
        data={currentData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isUpdate={isUpdate}
      />

      <DeleteConfirmation
        open={deleteOpen}
        handleClose={handleCloseDelete}
        handleDelete={handleDelete}
      />
    </Container>
  );
};

export default ControllerCrud;
