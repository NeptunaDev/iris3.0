import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Checkbox,
  SelectChangeEvent,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/Components/Input/Input";
import { SelectInput } from "@/Components/Input/SelectInput";
import { inputs } from "./data";
import ImageNetmask from "../../../../../public/netmask.png";
import Imglogo from "../../../../../public/ecorza.png";
import theme from "@/app/theme/theme";
import { FormData,  } from './interfaces';

const styleImg = {
  width: "100%",
  height: "100%",
};

interface PortalCautiveProps {
    formData: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangeSelect: (e: SelectChangeEvent<string>) => void;
    acceptedTerms: boolean;
    setAcceptedTerms: (value: boolean) => void;
    sendForm: () => void;
  }

export const PortalCautive: React.FC<PortalCautiveProps> = ({ 
  formData,
  handleChange,
  handleChangeSelect,
  acceptedTerms,
  setAcceptedTerms,
  sendForm,
}) => {
  return (
    <Stack bgcolor={"white"} minHeight={"100vh"} alignItems={"center"} py={5}>
      <Stack
        width={{
          md: "80%",
          xs: "90%",
        }}
        alignItems={"center"}
      >
        <Box
          flexGrow={1}
          textAlign="center"
          justifyContent={"space-between"}
          display={"flex"}
        >
          <Box>
            <Image
              src={Imglogo}
              alt="logo"
              style={styleImg}
              objectFit="cover"
            />
          </Box>
          <Box p={2}>
            <Image
              src={ImageNetmask}
              alt="logo"
              style={styleImg}
              objectFit="cover"
            />
          </Box>
        </Box>
        <Typography fontSize={"1.3REM"} fontWeight={500} color={"#000"}>
          Bienvenido al WIFI
        </Typography>
        <Typography fontSize={"1rem"} fontWeight={500} color={"#000"}>
          Para conectarte por favor diligencia o actualiza tus datos.
        </Typography>
      </Stack>
      <Stack
        width={{
          md: "60%",
          xs: "80%",
        }}
        maxWidth={"600px"}
        gap={3}
      >
        {inputs.map((input, index) => {
          if (input.type === "select") {
            return (
              <SelectInput
                key={index}
                label={input.label}
                value={formData[input.label].value}
                handleChange={handleChangeSelect}
                options={input.options || [""]}
              />
            );
          }
          return (
            <Input
              handleChange={handleChange}
              key={index}
              label={input.label}
              type={input.type}
              placeholder={input?.placeholder}
              value={formData[input.label].value}
              error={formData[input.label].error !== ""}
              errorMessage={formData[input.label].errorMessage}
            />
          );
        })}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Checkbox
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <Link href="https://www.ciscocolombia.co/pages/politica-de-privacidad" passHref>
            <Typography>
              Política de Privacidad y Tratamiento de Datos
            </Typography>
          </Link>
        </Stack>
        <Button
          onClick={sendForm}
          sx={{
            backgroundColor: theme.palette.primary.dark,
            color: "#fff",
            padding: "8px 16px",
            "&:hover": {
              backgroundColor: "#fff",
              color: theme.palette.primary.dark,
            },
          }}
          variant="contained"
          fullWidth
          disabled={!acceptedTerms}
        >
          Enviar
        </Button>
      </Stack>
    </Stack>
  );
};