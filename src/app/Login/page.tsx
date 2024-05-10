"use client";
import {
  Alert,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import Imglogo from "../../../public/image.png";
import useAuth from "@/hooks/useIfAuth";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";

interface SignInFormProps {
  onSwitchMode: (mode: any) => void;
}

const styleImg = {
  width: "100%",
  height: "100%",
};

const SignInForm: React.FC<SignInFormProps> = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const authorized = useAuth();

  const [alertBad, setAlertBad] = useState({
    showAlert: false,
    message: "",
    severity: "",
  });

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
    setAlertBad({ showAlert: false, message: "", severity: "" });
    const body = {
      email: email,
      password: password,
    };

    const JSONdata = JSON.stringify(body);
    try {
      const response = await fetch("api/auth/login", {
        body: JSONdata,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCookie("token", data.data.token);
        router.push("/AdminDashboard");
      }
    } catch (error) {
      console.log("Error en la solicitud:", error);
      setAlertBad({ showAlert: true, message: "", severity: "" });
    }
  };

  return (
    <Stack sx={{
      minHeight: '100vh'
    }} justifyContent={'center'} alignItems={'center'} >
    <Paper
      elevation={6}
      sx={{
        borderRadius: "20px",
        padding: "40px",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <CssBaseline/>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Box flexGrow={1} textAlign="center">
          <Box sx={{  objectFit: "cover" }}>
            <Image src={Imglogo} alt="logo" style={styleImg} />
          </Box>
        </Box>
        <Stack>
          <Stack spacing={4}>
            <Stack>
              <Typography variant="h4" fontWeight={600}>
                Bienvenido a Iris! 👋🏻
              </Typography>
              <Typography sx={{ mt: "15px" }}>
                Ingresa tu Correo Electrónico y tu Contraseña
              </Typography>
              {/* {alertBad && (
                <Box>
                  <Alert severity="error">Correo o Contraseña Incorrectos</Alert>
                </Box>
              )} */}
            </Stack>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <Stack spacing={3}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
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
                      ),
                    }}
                  />
                  <Link href={""}>
                    <Typography sx={{ textDecoration: "none" }}>
                      Olvidaste tu Contraseña?
                    </Typography>
                  </Link>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{backgroundColor: theme.palette.primary.dark }}
                  >
                    Ingresar
                  </Button>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Typography>No tienes una Cuenta?</Typography>
                  <Typography
                    fontWeight={600}
                    sx={{
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    Registrate ahora!
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
    </Stack>
  );
};

export default SignInForm;
