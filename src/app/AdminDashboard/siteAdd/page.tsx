"use client";
import {
  useState,
  useEffect,
  useMemo,
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
} from "@mui/material";
import CreateUpdateModal from "./components/CreateUpdateModal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { getCookie } from "cookies-next";
import { Site } from "@/lib/Site/domain/Site";
import { createSiteFetchRepository } from "@/lib/Site/infrastructure/SiteFetchRepository";
import { createSiteService } from "@/lib/Site/application/SiteUseCase";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/lib/Shared/domain/response";

const SiteCrud = () => {
  const siteRepository = useMemo(() => createSiteFetchRepository(), []);
  const siteService = useMemo(() => createSiteService(siteRepository), [siteRepository]);
  const [sites, setSites] = useState<Site[]>([]);

  const { data: siteData} = useQuery<APIResponse<Site[] | number>, Error>({
    queryKey: ['sites'],
    queryFn: () => siteService.find({}),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentData, setCurrentData] = useState<Site>({
    id: "",
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
    sslVerify: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const token = getCookie("token");

  const handleOpenCreate = () => {
    setCurrentData({
      id: "",
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
      sslVerify: "",
    });
    setIsUpdate(false);
    setModalOpen(true);
  };

  const handleOpenUpdate = (item: Site) => {
    setCurrentData(item);
    setIsUpdate(true);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleCloseDelete = () => setDeleteOpen(false);

  const handleSubmit = async () => {
    try {
      const { name, type, idOrganization, ...res } = currentData;
      let data = { idOrganization, type: type.toLowerCase(), name };
      if (type.toLocaleLowerCase() === "ubiquiti") data = { ...data, ...res };
      const response = await fetch("/api/site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const newData = await response.json();
      setModalOpen(false);
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
    }
  };

  const handleUpdate = async () => {
    const { type, name, host, port, username, sslVerify } = currentData;
    try {
      const response = await fetch(`/api/site/${currentData.id}`, {
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
          sslVerify,
        }),
      });
      const newData = await response.json();
    } catch (error) {
      console.log(error, "no pudo");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/site/${currentData.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error, "No fue Posible Eliminar el Site");
    }
    setDeleteOpen(false);
  };

  const handleOpenDelete = (item: Site) => {
    setCurrentData(item);
    setDeleteOpen(true);
  };

  useEffect(() => {
    if (!siteData || !siteData.data || !(typeof siteData.data === 'object')) return;
    setSites(siteData.data)
  }, [siteData])

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
            {sites.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
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
                <TableCell>{item.sslVerify}</TableCell>
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
        setCurrentData={setCurrentData}
        handleSubmit={isUpdate ? handleUpdate : handleSubmit}
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

export default SiteCrud;
