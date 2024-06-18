// src/App.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CreateUpdateModal from "./components/CreateUpdateModal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { getCookie } from "cookies-next";

interface DataItem {
  _id: string;
  name: string;
  createdAt: string;
  idClient: string;
}

const ControllerCrud: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentData, setCurrentData] = useState<DataItem>({
    _id: "",
    name: "",
    createdAt: "",
    idClient: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const token = getCookie("token");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    if (!token) {
      console.error("Token is missing!");
      return;
    }
    try {
      const response = await fetch("/api/organization", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleOpenCreate = () => {
    setCurrentData({ _id: "", name: "", createdAt: "", idClient: "" });
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

  const handleSubmit = async () => {
    if (isUpdate) {
      await handleUpdate();
    } else {
      if (!token) {
        console.error("Token is missing!");
        return;
      }

      try {
        const response = await fetch("/api/organization", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: currentData.name }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData((prev) => [...prev, { ...currentData, _id: result._id }]);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!token) {
      console.error("Token is missing!");
      return;
    }

    try {
      const response = await fetch(`/api/organization/${currentData._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Actualizar el estado para eliminar el proyecto localmente
      setData((prev) => prev.filter((item) => item._id !== currentData._id));
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }

    setDeleteOpen(false);
  };

  const handleUpdate = async () => {
    if (!token) {
      console.error("Token is missing!");
      return;
    }

    try {
      const response = await fetch(`/api/organization/${currentData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: currentData.name }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setData((prev) =>
        prev.map((item) => (item._id === currentData._id ? currentData : item))
      );
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }

    setModalOpen(false);
  };

  const handleOpenDelete = (item: DataItem) => {
    setCurrentData(item);
    setDeleteOpen(true);
  };

  return (
    <Container sx={{ backgroundColor: "#fff", borderRadius: "20px" }}>
      <h1>Crear Organización</h1>
      <Button variant="contained" color="primary" onClick={handleOpenCreate}>
        Crear
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Creado En</TableCell>
              <TableCell>ID Cliente</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item._id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{item.idClient}</TableCell>
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