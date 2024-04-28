"use client";
import React, { useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  styled
} from "@mui/material";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import Link from "next/link";
// import { useRouter } from "next/router";

// "email": "juan4@mail.com",
//     "password": "juan123."

const LinkStyled = styled("a")(({ theme }) => ({
  fontSize: "0.95rem",
  textDecoration: "none",
  color: theme.palette.primary.main
}));

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async () => {
    const body = {
      email: email,
      password: password
    };
    const JSONdata = JSON.stringify(body);
    try {
      const response = await fetch("api/auth/login", {
        body: JSONdata,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log("La solicitud fue exitosa", response.status);
        // router.push("/AdminDashboard");
      } else {
        console.log("La solicitud no fue exitosa", response.status);
        // Manejar el caso en que la solicitud no fue exitosa
      }
    } catch (error) {
      console.log("Error en la solicitud:", error);
    }
  };

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
              label="E-mail"
              name="email"
              autoComplete="username"
              autoFocus
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? (
                        <MdOutlineVisibility />
                      ) : (
                        <MdOutlineVisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {/* <Link href={""}>
              <LinkStyled>Olvidaste tu Contraseña?</LinkStyled>
            </Link> */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: "30px" }}
              onClick={handleSubmit}
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
