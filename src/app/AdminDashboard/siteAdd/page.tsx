// src/App.tsx
"use client";
import React, {
  useState,
  useEffect,
  ChangeEventHandler,
  ChangeEvent,
} from "react";
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
  host: string;
  port: string;
  username: string;
  password: string;
  sslverify: string;
}

export interface Organization {
  id: string;
  name: string;
  _id: string;
}

const SiteCrud: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
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
    host: "",
    port: "",
    username: "",
    password: "",
    sslverify: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const token = getCookie("token");

  useEffect(() => {
    fetchSites();
    fetchOrganizations();
  }, [token]);

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
      host: "",
      port: "",
      username: "",
      password: "",
      sslverify: "",
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

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setCurrentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setCurrentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as string;
    setCurrentData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async () => {
    try {
      const {
        idOrganization,
        type,
        name,
        siteId,
        host,
        port,
        username,
        password,
        sslverify,
      } = currentData;
      const response = await fetch("/api/site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idOrganization,
          type: type.toLowerCase(),
          name,
          siteId,
          host,
          port,
          username,
          password,
          sslverify,
        }),
      });
      const newData = await response.json();
      if (newData.status === 200) {
        setData((prev) => {
          const exists = prev.some((item) => item._id === newData.data._id);
          if (!exists) {
            return [...prev, newData.data];
          }
          return prev;
        });
      }
      setModalOpen(false);
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
    }
  };

  const handleUpdate = async () => {
    const { type, name, host, port, username, sslverify } = currentData;
    try {
      const response = await fetch(`/api/site/${currentData._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          name,
          host,
          port,
          username,
          sslverify,
        }),
      });
      const newData = await response.json();
      if (newData.status === 200) {
        setData((prev) =>
          prev.map((item) =>
            item._id === newData.data._id ? newData.data : item
          )
        );
        setModalOpen(false);
      }
    } catch (error) {
      console.log(error, "no pudo");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/site/${currentData._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error, "No fue Posible Eliminar el Site");
    }
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
              <TableCell>Host</TableCell>
              <TableCell>Puerto</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Virificación SSL</TableCell>
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
                <TableCell>{item.host}</TableCell>
                <TableCell>{item.port}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.sslverify}</TableCell>
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
        handleTypeChange={handleTypeChange}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleSubmit={isUpdate ? handleUpdate : handleSubmit}
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
