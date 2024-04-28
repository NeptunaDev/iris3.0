import React from "react";
import { Grid, Paper, TextField, Button, Box } from "@mui/material";

const Login: React.FC = () => {
  return (
    <Grid
      container
      component="main"
      sx={{
        height: "50vh",
        alignItems: "center",
        justifyContent: "center",
        pt: "200px"
      }}
    >
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            margin: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "50px"
          }}
        >
          <h2>Iniciar Sesión en Iris</h2>
          <form noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuario"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: "30px" }}
            >
              Ingresar
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
