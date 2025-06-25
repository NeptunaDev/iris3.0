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
import { AP, APUpdate } from "@/lib/AP/domain/AP";
import { createAPFetchRepository } from "@/lib/AP/infrastructure/APFetchRepository";
import { createAPService } from "@/lib/AP/application/APUseCase";
import { useQuery } from "@tanstack/react-query";

const initialData: APUpdate = {
  id: "",
  idSite: "",
  mac: "",
  name: "",
}

const ApCrud: React.FC = () => {
  const apRepository = useMemo(() => createAPFetchRepository(), []);
  const apService = useMemo(() => createAPService(apRepository), [apRepository]);

  const [aps, setAps] = useState<AP[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentData, setCurrentData] = useState<APUpdate>(initialData);
  const [idToDelete, setIdToDelete] = useState<string>("");

  const { data: apsData } = useQuery({
    queryKey: ['aps'],
    queryFn: () => apService.find(),
  });

  const handleOpenCreate = () => {
    setCurrentData(initialData);
    setModalOpen(true);
  };

  const handleOpenUpdate = (item: AP) => {
    setCurrentData(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentData(initialData);
    setModalOpen(false);
  }

  const handleCloseDelete = () => {
    setCurrentData(initialData);
    setDeleteOpen(false);
  }

  const handleOpenDelete = (item: AP) => {
    setIdToDelete(item.id);
    setDeleteOpen(true);
  };

  // Set only with data from the response
  useEffect(() => {
    if (!apsData || !apsData.data || !(typeof apsData.data === 'object')) return;
    setAps(apsData.data)
  }, [apsData])

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
            {aps.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
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
        apUpdate={currentData}
      />

      <DeleteConfirmation
        open={deleteOpen}
        handleClose={handleCloseDelete}
        idToDelete={idToDelete}
      />
    </Container>
  );
};

export default ApCrud;
