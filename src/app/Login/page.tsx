"use client";
import {
  Alert,
  Box,
  Button,
  CssBaseline,
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
import { useTheme } from "@mui/material/styles";

const styleImg = {
  width: "100%",
  height: "100%",
};

interface AlertState {
  showAlert: boolean;
  message: string;
  severity: "error" | "info" | "success" | "warning";
}

const SignInForm: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [alertBad, setAlertBad] = useState<AlertState>({
    showAlert: false,
    message: "",
    severity: "error",
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
    setAlertBad({ showAlert: false, message: "", severity: "error" });
    if (!email || !password) {
      setAlertBad({
        showAlert: true,
        message: "Por favor complete todos los campos",
        severity: "error",
      });
      return;
    }
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
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log("🚀 ~ handleSubmit ~ data:", data)
        setCookie("token", data.data.token);
        router.push("/AdminDashboard");
      } else {
        setAlertBad({
          showAlert: true,
          message: "Correo o Contraseña Incorrectos",
          severity: "error",
        });
      }
    } catch (error) {
      setAlertBad({
        showAlert: true,
        message: "Error en la solicitud",
        severity: "error",
      });
    }
  };

  return (
    <Stack
      sx={{
        minHeight: "100vh",
      }}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Paper
        elevation={6}
        sx={{
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        <CssBaseline />
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          <Box flexGrow={1} textAlign="center">
            <Box sx={{ objectFit: "cover" }}>
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
                {alertBad.showAlert && (
                  <Box>
                    <Alert severity={alertBad.severity}>{alertBad.message}</Alert>
                  </Box>
                )}
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
                      autoComplete="email"
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
                    <Link href="/reset-password">
                      <Typography sx={{ textDecoration: "none" }}>
                        Olvidaste tu Contraseña?
                      </Typography>
                    </Link>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleSubmit}
                      sx={{ backgroundColor: theme.palette.primary.dark }}
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
