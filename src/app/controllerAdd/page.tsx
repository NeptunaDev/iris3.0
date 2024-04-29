"use client";
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next";
import { Grid, Paper, TextField, Button, Typography } from "@mui/material";

const ControllerCrud: React.FC = () => {
  const token = getCookie("token");
  let idClient: string | undefined;
  const [ap, setAp] = useState<string>("");
  const [site, setSite] = useState<string>("");
  const [controllers, setControllers] = useState<any[]>([]);

  if (token) {
    const decodedToken = jwtDecode(token);
    idClient = decodedToken.id;
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
        const response = await fetch("api/controller", {
          body: JSONdata,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
        console.log("🚀 ~ handleCreate ~ response:", response);
        if (response.ok) {
          const data = await response.json();
          console.log("🚀 ~ handleCreate ~ data:", data);
        }
      } catch (error) {
        console.log("Error en la solicitud:", error);
      }
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
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
        <Button variant="contained" color="secondary" sx={{ marginTop: 2 }}>
          Delete
        </Button>
      </Grid>
    </Grid>
  );
};

export default ControllerCrud;
