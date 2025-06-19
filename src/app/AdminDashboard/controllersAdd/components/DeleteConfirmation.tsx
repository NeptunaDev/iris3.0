// src/components/DeleteConfirmation.tsx
import React, { useMemo } from 'react';
import { Modal, Box, Button, Typography, CircularProgress } from '@mui/material';
import { createOrganizationFetchRepository } from '@/lib/Organization/infrastructure/OrganizationFetchRepository';
import { createOrganizationService } from '@/lib/Organization/application/OrganizationUseCase';
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
  justifyContent: 'center',
  alignItems: 'center'
};

interface DeleteConfirmationProps {
  open: boolean;
  handleClose: () => void;
  idToDelete: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  handleClose,
  idToDelete,
}) => {
  const organizationRepository = useMemo(() => createOrganizationFetchRepository(), []);
  const organizationService = useMemo(() => createOrganizationService(organizationRepository), [organizationRepository]);
  const queryClient = useQueryClient();

  const { mutate: deleteOrganization, isPending, isError } = useMutation({
    mutationFn: (id: string) => organizationService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      handleClose();
    },
    onError: (error) => console.error(error)
  })

  return (
    <Modal open={isPending ? true : open} onClose={isPending ? undefined : handleClose}>
      <Box sx={style}>
        <Typography variant="h3" gutterBottom >
          ¿Está seguro de que desea eliminar este registro?
        </Typography>
        <Button variant="contained" color="primary" onClick={() => deleteOrganization(idToDelete)} disabled={isPending}>
          Sí
          {isPending && <CircularProgress size={20} />}
        </Button>
        <Button variant="contained" color="warning" onClick={handleClose} sx={{ ml: 2 }} disabled={isPending}>
          No
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmation;
