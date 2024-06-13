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
  SelectChangeEvent,
} from "@mui/material";
import CreateUpdateModal from "./components/CreateUpdateModal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { getCookie } from "cookies-next";

interface DataItem {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  idOrganization: string;
  siteId: string;
  type: string;
}

interface Organization {
  id: string;
  name: string;
  _id: string;
}

const SiteCrud: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  console.log("🚀 ~ organizations:", organizations)
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentData, setCurrentData] = useState<DataItem>({
    _id: "",
    name: "",
    createdAt: "",
    updatedAt: "",
    idOrganization: "",
    siteId: "",
    type: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const token = getCookie("token");

  useEffect(() => {
    fetchSites();
    fetchOrganizations();
  }, []);

  const fetchSites = async () => {
    if (!token) {
      console.error("Token is missing!");
      return;
    }
    try {
      const response = await fetch("/api/site", {
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

  const fetchOrganizations = async () => {
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
      setOrganizations(result.data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleOpenCreate = () => {
    setCurrentData({
      _id: "",
      name: "",
      createdAt: "",
      updatedAt: "",
      idOrganization: "",
      siteId: "",
      type: "",
    });
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

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setCurrentData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSelectChange = (e: SelectChangeEvent<string>) => {
  //   const { value } = e.target;
  //   setCurrentData((prev) => ({ ...prev, idOrganization: value }));
  // };

  const handleTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string;
    setCurrentData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async () => {
    const url = isUpdate ? `/api/site/${currentData._id}` : "/api/site";
    const method = isUpdate ? "PUT" : "POST";
  
    if (!token) {
      console.error("Token is missing!");
      return;
    }
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idOrganization: currentData.idOrganization,
          type: currentData.type,
          name: currentData.name,
          siteId: currentData.siteId,
        }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
  
      const result = await response.json();
      if (isUpdate) {
        setData((prev) => prev.map((item) => (item._id === currentData._id ? result.data : item)));
      } else {
        setData((prev) => [...prev, result.data]);
      }
  
      setModalOpen(false);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((item) => item._id !== currentData._id));
    setDeleteOpen(false);
  };

  const handleOpenDelete = (item: DataItem) => {
    setCurrentData(item);
    setDeleteOpen(true);
  };

  return (
    <Container sx={{ backgroundColor: "#fff", borderRadius: "20px" }}>
      <h1>Crear Site</h1>
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
              <TableCell>Actualizado En</TableCell>
              <TableCell>ID Organización</TableCell>
              <TableCell>ID Sitio</TableCell>
              <TableCell>Tipo</TableCell>
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
                <TableCell>
                  {new Date(item.updatedAt).toLocaleString()}
                </TableCell>
                <TableCell>{item.idOrganization}</TableCell>
                <TableCell>{item.siteId}</TableCell>
                <TableCell>{item.type}</TableCell>
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
        handleTypeChange={handleTypeChange}
        handleSubmit={handleSubmit}
        isUpdate={isUpdate}
        organizations={organizations}
      />

      <DeleteConfirmation
        open={deleteOpen}
        handleClose={handleCloseDelete}
        handleDelete={handleDelete}
      />
    </Container>
  );
};

export default SiteCrud;