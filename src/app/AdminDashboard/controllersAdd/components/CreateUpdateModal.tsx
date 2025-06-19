// src/components/CreateUpdateModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Box, TextField, Button, CircularProgress } from '@mui/material';
import { EditOrganization } from '../interfaces/EditOrganization';
import { createOrganizationFetchRepository } from '@/lib/Organization/infrastructure/OrganizationFetchRepository';
import { createOrganizationService } from '@/lib/Organization/application/OrganizationUseCase';
import { jwtDecode } from 'jwt-decode';
import { getCookie } from 'cookies-next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface CreateUpdateModalProps {
  open: boolean;
  handleClose: () => void;
  editOrganization: EditOrganization;
}

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  open,
  handleClose,
  editOrganization,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [idClient, setIdClient] = useState<string>('');
  const [isUpdate, setIsUpdate] = useState(false);

  const organizationRepository = useMemo(() => createOrganizationFetchRepository(), []);
  const organizationService = useMemo(() => createOrganizationService(organizationRepository), [organizationRepository]);

  // Token decoding effect
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

  // Mutations with invalidation
  const { mutate: updateOrganization, isPending: isUpdating } = useMutation({
    mutationFn: (id: string) => organizationService.update(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      handleCloseModal();
    },
    onError: (error) => console.error(error)
  });

  const { mutate: createOrganization, isPending: isCreating } = useMutation({
    mutationFn: () => organizationService.create({ name, idClient }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      handleCloseModal();
    },
    onError: (error) => console.error(error)
  });

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (isUpdate) {
      updateOrganization(editOrganization.id as string);
    } else {
      createOrganization();
    }
  };

  const isLoading = isUpdating || isCreating;

  const handleCloseModal = () => {
    setName('');
    handleClose();
  };

  useEffect(() => {
    setName(editOrganization.name || '');
    setIsUpdate(editOrganization.id !== null);
  }, [editOrganization.name, editOrganization.id]);

  return (
    <Modal open={isLoading || open} onClose={isLoading ? undefined : handleCloseModal}>
      <Box sx={style}>
        <h2>{isUpdate ? 'Actualizar' : 'Crear'} Registro</h2>
        <TextField
          label="Nombre"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
          {isUpdate ? 'Actualizar' : 'Crear'}
          {isLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateUpdateModal;
