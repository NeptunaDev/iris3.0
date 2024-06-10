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

const ApCrud: React.FC = () => {
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
      <h1>Crea AP</h1>
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

export default ApCrud;
