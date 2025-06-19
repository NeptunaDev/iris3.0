// src/App.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { createOrganizationFetchRepository } from "@/lib/Organization/infrastructure/OrganizationFetchRepository";
import { createOrganizationService } from "@/lib/Organization/application/OrganizationUseCase";
import { useQuery } from "@tanstack/react-query";
import { Organization } from "@/lib/Organization/domain/Organization";
import { APIResponse } from "@/lib/Shared/domain/response";
import { jwtDecode } from "jwt-decode";
import { EditOrganization } from "./interfaces/EditOrganization";

const initialEditOrganization: EditOrganization = {
  id: null,
  name: null,
}

const ControllerCrud: React.FC = () => {
  const organizationRepository = useMemo(() => createOrganizationFetchRepository(), []);
  const organizationService = useMemo(() => createOrganizationService(organizationRepository), [organizationRepository]);

  const [editOrganization, setEditOrganization] = useState<EditOrganization>(initialEditOrganization);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string>('');
  const [idClient, setIdClient] = useState<string>('');

  const { data } = useQuery<APIResponse<Organization[] | number>, Error>({
    queryKey: ['organizations'],
    queryFn: () => organizationService.find({ idClient }),
    enabled: !!idClient
  });

  const handleOpenCreate = () => {
    setEditOrganization(initialEditOrganization);
    setModalOpen(true);
  };

  const handleOpenEdit = (organization: Organization) => {
    setEditOrganization({
      id: organization.id,
      name: organization.name,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleCloseDelete = () => setDeleteOpen(false);

  const handleOpenDelete = (id: string) => {
    setDeleteOpen(true);
    setIdToDelete(id);
  }

  useEffect(() => {
    try {
      const token = getCookie("token") as string;
      if (token) {
        const { id } = jwtDecode(token) as { id: string };
        setIdClient(id);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []);

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
            {data?.data && typeof data.data === 'object' && data.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{item.idClient}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenEdit(item)}
                  >
                    Actualizar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleOpenDelete(item.id)}
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
        editOrganization={editOrganization}
      />

      <DeleteConfirmation
        idToDelete={idToDelete}
        open={deleteOpen}
        handleClose={handleCloseDelete}
      />
    </Container>
  );
};

export default ControllerCrud;