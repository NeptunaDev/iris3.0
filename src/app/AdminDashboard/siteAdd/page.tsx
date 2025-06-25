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
import { Site, SiteUpdate } from "@/lib/Site/domain/Site";
import { createSiteFetchRepository } from "@/lib/Site/infrastructure/SiteFetchRepository";
import { createSiteService } from "@/lib/Site/application/SiteUseCase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { APIResponse } from "@/lib/Shared/domain/response";

const initialData: SiteUpdate = {
  id: "",
  name: "",
  idOrganization: "",
  siteId: "",
  type: "",
  host: "",
  port: "",
  username: "",
  password: "",
  sslverify: false,
}

const SiteCrud = () => {
  const siteRepository = useMemo(() => createSiteFetchRepository(), []);
  const siteService = useMemo(() => createSiteService(siteRepository), [siteRepository]);
  const [sites, setSites] = useState<Site[]>([]);
  const [idToDelete, setIdToDelete] = useState<string>("");

  const { data: siteData } = useQuery<APIResponse<Site[] | number>, Error>({
    queryKey: ['sites'],
    queryFn: () => siteService.find({}),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentData, setCurrentData] = useState<SiteUpdate>(initialData);
  const token = getCookie("token");

  const handleOpenCreate = () => {
    setCurrentData(initialData);
    setModalOpen(true);
  };

  const handleOpenUpdate = (item: Site) => {
    const { createdAt, updatedAt, ...rest } = item;
    setCurrentData(rest);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentData(initialData);
    setModalOpen(false);
  }

  const handleCloseDelete = () => {
    setIdToDelete("");
    setDeleteOpen(false);
  }

  const handleOpenDelete = (item: Site) => {
    setIdToDelete(item.id);
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
                <TableCell>{item.sslverify ? "Si" : "No"}</TableCell>
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
      />

      <DeleteConfirmation
        open={deleteOpen}
        handleClose={handleCloseDelete}
        idToDelete={idToDelete}
      />
    </Container>
  );
};

export default SiteCrud;
