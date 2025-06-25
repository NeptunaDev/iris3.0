// src/components/CreateUpdateModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { APCreate, APUpdate } from "@/lib/AP/domain/AP";
import { createSiteFetchRepository } from "@/lib/Site/infrastructure/SiteFetchRepository";
import { createSiteService } from "@/lib/Site/application/SiteUseCase";
import { APIResponse } from "@/lib/Shared/domain/response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Site } from "@/lib/Site/domain/Site";
import { createAPFetchRepository } from "@/lib/AP/infrastructure/APFetchRepository";
import { createAPService } from "@/lib/AP/application/APUseCase";

const initialData: APCreate = {
  idSite: "",
  mac: "",
  name: "",
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface CreateUpdateModalProps {
  open: boolean;
  handleClose: () => void;
  apUpdate: APUpdate;
}

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  open,
  handleClose,
  apUpdate,
}) => {
  const siteRepository = useMemo(() => createSiteFetchRepository(), []);
  const siteService = useMemo(() => createSiteService(siteRepository), [siteRepository]);
  const apRepository = useMemo(() => createAPFetchRepository(), []);
  const apService = useMemo(() => createAPService(apRepository), [apRepository]);

  const [siteOptions, setSiteOptions] = useState<Site[]>([]);
  const [apData, setApData] = useState<APCreate>(initialData);
  const isUpdate = !!('id' in apUpdate) && !!apUpdate.id;
  const queryClient = useQueryClient();

  const { data: dataSites } = useQuery<APIResponse<Site[] | number>, Error>({
    queryKey: ['sites'],
    queryFn: () => siteService.find({}),
  });

  const { mutate: mutateCreateAp, isPending: isPendingCreateAp } = useMutation({
    mutationFn: (ap: APCreate) => apService.create(ap),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aps'] });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error creating AP:', error);
    },
  });

  const { mutate: mutateUpdateAp, isPending: isPendingUpdateAp } = useMutation({
    mutationFn: (ap: APUpdate) => apService.update(ap.id, ap),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aps'] });
      handleClose();
    },
    onError: (error) => {
      console.error('Error updating AP:', error);
    },
  });
  const isLoading = isPendingCreateAp || isPendingUpdateAp;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setApData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('submit', apData)
    if (isUpdate) {
      mutateUpdateAp({
        id: apUpdate.id,
        ...apData
      })
      return
    }
    mutateCreateAp(apData)
  }

  const handleCloseModal = () => {
    setApData(initialData);
    handleClose();
  }

  // Set only with data from the response
  useEffect(() => {
    if (!dataSites || !dataSites.data || !(typeof dataSites.data === 'object')) return;
    setSiteOptions(dataSites.data)
  }, [dataSites])

  // Set data ap whe is update
  useEffect(() => {
    setApData({
      idSite: apUpdate.idSite || "",
      mac: apUpdate.mac || "",
      name: apUpdate.name || "",
    })
  }, [apUpdate])

  return (
    <Modal open={isLoading ? true : open} onClose={isLoading ? undefined : handleCloseModal}>
      <Box sx={style}>
        <h2>{isUpdate ? "Actualizar AP" : "Crear AP"}</h2>
        <FormControl fullWidth margin="normal">
          <InputLabel>ID del Sitio</InputLabel>
          <Select
            label="ID del Sitio"
            name="idSite"
            value={apData.idSite}
            onChange={handleSelectChange}
            fullWidth
            disabled={isUpdate}
          >
            {siteOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Nombre"
          name="name"
          value={apData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="MAC"
          name="mac"
          value={apData.mac}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2, display: 'flex', alignItems: 'center' }}
          disabled={isLoading}
        >
          {isUpdate ? "Actualizar" : "Crear"}
          {isLoading && <CircularProgress size={20} sx={{ ml: 1, color: 'white' }} />}
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateUpdateModal;
