"use client";
// src/App.tsx
import React, { useEffect, useState } from "react";
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
  idSite: string;
  mac: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  __v: number;
}

interface SiteItem {
  _id: string;
  idOrganization: string;
  name: string;
  siteId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ApCrud: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [dataSites, setDataSites] = useState<SiteItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentData, setCurrentData] = useState<DataItem>({
    _id: "",
    idSite: "",
    mac: "",
    createdAt: "",
    updatedAt: "",
    name: "",
    __v: 0,
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const token = getCookie("token");

  useEffect(() => {
    fetch("/api/ap", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Verifica si data contiene duplicados
        const uniqueData = data.data.filter(
          (item: { _id: any }, index: any, self: any[]) =>
            index === self.findIndex((t) => t._id === item._id)
        );
        setData(uniqueData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [token]);

  useEffect(() => {
    fetchSites();
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
      setDataSites(result.data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleOpenCreate = () => {
    setCurrentData({
      _id: "",
      idSite: "",
      mac: "",
      createdAt: "",
      updatedAt: "",
      name: "",
      __v: 0,
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

  const handleSubmit = async () => {
    try {
      const { mac, idSite, name } = currentData;
      const response = await fetch("/api/ap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mac, idSite, name }),
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
      console.log(error);
    }
  };

  const handleDelete = () => {
    fetch(`/api/ap/${currentData._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setData((prev) => prev.filter((item) => item._id !== currentData._id));
      })
      .catch((error) => console.error("Error deleting data:", error));

    setDeleteOpen(false);
  };

  const handleUpdate = async () => {
    const { mac } = currentData;
    try {
      const response = await fetch(`/api/ap/${currentData._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mac }),
      });
      console.log(response);
      const updatedData = await response.json();
      console.log("🚀 ~ handleUpdate ~ updatedData:", updatedData)
      if (!response.ok) {
        throw new Error("Error al actualizar los datos");
      }
      setData((prev) =>
        prev.map((item) => (item._id === currentData._id ? updatedData : item))
      );
      setDeleteOpen(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleOpenDelete = (item: DataItem) => {
    setCurrentData(item);
    setDeleteOpen(true);
  };

  return (
    <Container sx={{ backgroundColor: "#fff", borderRadius: "20px" }}>
      <h1>Crear AP</h1>
      <Button variant="contained" color="primary" onClick={handleOpenCreate}>
        Crear
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Id Site</TableCell>
              <TableCell>MAC</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item._id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.idSite}</TableCell>
                <TableCell>{item.mac}</TableCell>
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
        handleSubmit={isUpdate ? handleUpdate : handleSubmit}
        siteOptions={dataSites}
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

export default ApCrud;
