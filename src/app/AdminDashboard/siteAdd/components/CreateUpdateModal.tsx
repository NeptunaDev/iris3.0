import React, { ChangeEvent, ChangeEventHandler, Dispatch, useEffect, useMemo, useState } from "react";
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
  Grid,
  Stack,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { Organization } from "@/lib/Organization/domain/Organization";
import { createOrganizationFetchRepository } from "@/lib/Organization/infrastructure/OrganizationFetchRepository";
import { createOrganizationService } from "@/lib/Organization/application/OrganizationUseCase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APIResponse } from "@/lib/Shared/domain/response";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { SiteCreate, SiteUpdate } from "@/lib/Site/domain/Site";
import { createSiteFetchRepository } from "@/lib/Site/infrastructure/SiteFetchRepository";
import { createSiteService } from "@/lib/Site/application/SiteUseCase";
import { generateRandomText } from "@/utils/strings/generateRandomText";

const initialData: SiteCreate = {
  name: "",
  idOrganization: "",
  siteId: "",
  type: "",
  host: null,
  port: null,
  username: null,
  password: null,
  sslverify: false,
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadious: "20px",
};

interface CreateUpdateModalProps {
  open: boolean;
  handleClose: () => void;
  data: SiteUpdate
}

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  open,
  handleClose,
  data
}) => {
  const organizationRepository = useMemo(() => createOrganizationFetchRepository(), []);
  const organizationService = useMemo(() => createOrganizationService(organizationRepository), [organizationRepository]);
  const siteRepository = useMemo(() => createSiteFetchRepository(), []);
  const siteService = useMemo(() => createSiteService(siteRepository), [siteRepository]);
  const queryClient = useQueryClient();

  const [idClient, setIdClient] = useState<string>('');
  const { data: dataOrganizations } = useQuery<APIResponse<Organization[] | number>, Error>({
    queryKey: ['organizations'],
    queryFn: () => organizationService.find({ idClient }),
    enabled: !!idClient
  });
  const isUpdate = !!('id' in data) && !!data.id;
  const [siteData, setSiteData] = useState<SiteCreate>(initialData);

  const { mutate: mutateCreateSite, isPending: isPendingCreateSite } = useMutation({
    mutationFn: (site: SiteCreate) => siteService.create(site),
    onSuccess: () => {
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    }
  })

  const { mutate: mutateUpdateSite, isPending: isPendingUpdateSite } = useMutation({
    mutationFn: (site: SiteUpdate) => siteService.update(site.id, site),
    onSuccess: () => {
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    }
  })
  const isLoading = isPendingCreateSite || isPendingUpdateSite;

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setSiteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setSiteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSiteData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCloseModal = () => {
    setSiteData(initialData);
    handleClose();
  }

  useEffect(() => {
    setSiteData({
      name: data.name || "",
      idOrganization: data.idOrganization || "",
      siteId: data.siteId || "",
      type: data.type || "",
      host: data.host || "",
      port: data.port || "",
      username: data.username || "",
      password: data.password || "",
      sslverify: data.sslverify === true,
    });
  }, [data]);

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
    <Modal open={isLoading || open} onClose={isLoading ? () => { } : handleCloseModal}>
      <>
        {siteData.type === "" ? (
          <Stack sx={style}>
            <h2>Seleccione un tipo de sitio</h2>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setSiteData((prev) => ({ ...prev, type: "meraki", siteId: generateRandomText(8) }));
              }}
            >
              Meraki
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {

                setSiteData((prev) => ({ ...prev, type: "ubiquiti" }));
              }}
            >
              Ubiquiti
            </Button>
          </Stack>
        ) : (
          <Box sx={style}>
            <h2>{isUpdate ? "Actualizar" : "Crear"} Site</h2>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Nombre"
                  name="name"
                  value={siteData.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Organización</InputLabel>
                  <Select
                    label="Organización"
                    name="idOrganization"
                    value={siteData.idOrganization}
                    onChange={handleSelectChange}
                  >
                    {dataOrganizations?.data && typeof dataOrganizations.data === 'object' && dataOrganizations.data.map((org) => (
                      <MenuItem key={org.id} value={org.id}>
                        {org.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {siteData.type === "ubiquiti" && (
                <>
                  <Grid item xs={6}>
                    <TextField
                      label="ID Sitio"
                      name="siteId"
                      value={siteData.siteId}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Host"
                      name="host"
                      value={siteData.host}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Puerto"
                      name="port"
                      value={siteData.port}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Usuario"
                      name="username"
                      value={siteData.username}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Contraseña"
                      name="password"
                      value={siteData.password}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="sslverify"
                          checked={siteData?.sslverify === true}
                          onChange={handleCheckboxChange}
                          color="primary"
                        />
                      }
                      label="Verificación SSL"
                      sx={{ mt: 2 }} // Margen superior para alineación visual
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Box mt={2}>
              <Button
                variant="contained"
                disabled={isLoading}
                color="primary"
                onClick={() => {
                  const site = Object.fromEntries(
                    Object.entries(siteData).filter(([key, value]) => value !== null && value !== "" && value !== undefined)
                  );
                  if (isUpdate) {
                    mutateUpdateSite({ ...site, id: data.id } as SiteUpdate);
                    return;
                  }
                  mutateCreateSite(site as SiteCreate);
                }}
              >
                {isUpdate ? "Actualizar" : "Crear"}
                {isLoading && <CircularProgress size={20} />}
              </Button>
            </Box>
          </Box>
        )}
      </>
    </Modal>
  );
};

export default CreateUpdateModal;