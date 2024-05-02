"use client";
import React, { useState } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next";
import { Grid, Paper, TextField, Button, Typography, CssBaseline, Stack } from "@mui/material";

interface PersonalToken extends JwtPayload  {
  id: string 
}

interface Controller {
  id: string;
  ap: string;
  site: string;
}

const ControllerCrud: React.FC = () => {
  const token = getCookie("token");
  let idClient: string | undefined;
  const [ap, setAp] = useState('');
  const [site, setSite] = useState('');
  const [controllers, setControllers] = useState<Controller[]>([]);

  if (token) {
    const decodedToken = jwtDecode<PersonalToken>(token);
    idClient = decodedToken.id
  }

  const handleCreate = async () => {
    if (idClient) {
      const body = {
        idClient: idClient,
        ap: ap,
        site: site
      };
      const JSONdata = JSON.stringify(body);
      try {
        const response = await fetch("/api/controller", {
          body: JSONdata,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log("🚀 ~ handleCreate ~ data:", data.data)
          setControllers([...controllers, data]); // Agrega la nueva controladora al estado
          setAp(''); // Limpia los campos después de la creación exitosa
          setSite('');
        }
      } catch (error) {
        console.log("Error en la solicitud:", error);
      }
    }
  };

  const handleDelete = async (controllerId: string) => {
    try {
      const response = await fetch(`/api/controller/${controllerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        setControllers(controllers.filter(controller => controller.id !== controllerId));
      }
    } catch (error) {
      console.log("Error en la solicitud:", error);
    }
  };

  return (
    <Stack sx={{
      minHeight: '100vh'
    }} justifyContent={'center'} alignItems={'center'} >
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Create Controller
          </Typography>
          <TextField
            label="AP"
            fullWidth
            value={ap}
            onChange={(e) => setAp(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Site"
            fullWidth
            value={site}
            onChange={(e) => setSite(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            sx={{ marginRight: 2 }}
          >
            Create
          </Button>
        </Paper>
        <Typography variant="h5" sx={{ marginTop: 3 }}>
          Controllers
        </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginTop: 2 }}
            >
              Delete
            </Button>
      </Grid>
    </Grid>
    </Stack>
  );
};

export default ControllerCrud;
