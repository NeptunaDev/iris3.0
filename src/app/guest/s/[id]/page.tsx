"use client";
import { Input } from "@/Components/Input/Input";
import {
  Box,
  Button,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { inputs } from "./data";
import { SelectInput } from "@/Components/Input/SelectInput";
import { useRouter, useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";
import { Controller } from "@/models/Controller.model";
import Image from "next/image";
import ImageNetmask from "../../../../../public/netmask.png";
import Imglogo from "../../../../../public/ecorza.png";
import theme from "@/app/theme/theme";

const styleImg = {
  width: "100%",
  height: "100%",
};

export default function PortalCautive({ params }: { params: { id: string } }) {
  const queries = getQueriesStr(useSearchParams().toString());
  const router = useRouter();

  interface FormData {
    [key: string]: {
      label: string;
      value: string;
      type: string;
    };
  }
  const [formData, setFormData] = useState<FormData>(
    inputs.reduce(
      (acc, input) => ({
        ...acc,
        [input.label]: {
          label: input.label,
          value: input?.options?.[0] || "",
          type: "text",
        },
      }),
      {}
    )
  );
  const [controller, setController] = useState<any>({});
  const [view, setView] = useState<any>();
  const [isLogged, setIsLogged] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev.name,
        value,
      },
    }));
  };

  const handleChangeSelect = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev.name,
        value,
      },
    }));
  };

  const sendForm = async () => {
    const responseConn = await fetch(`/api/connecting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: queries.id.replaceAll("%3A", ":"),
        ap: queries.ap.replaceAll("%3A", ":"),
        site: params.id,
      }),
    });
    if (!responseConn.ok) {
      // No puede entrar
      return;
    }

    const response = await fetch(`/api/view`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: view._id,
        isLogin: true,
        info: Object.values(formData),
      }),
    });
    if (!response.ok) {
      // No actualizo cliente
      return;
    }
    setIsLogged(true);
    router.push("https://www.google.com/?hl=es");
  };

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(
        `/api/controller?site=${params.id}&ap=${queries?.ap}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setController(data.data[0]);
    };
    getData();
  }, []);

  useEffect(() => {
    if (!controller?._id || view) return;
    const createView = async () => {
      const response = await fetch(`/api/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idController: controller._id,
          ap: queries?.id,
        }),
      });
      const data = await response.json();
      setView(data.data);
    };
    createView();
  }, [controller]);

  // if (isLogged) {
  //   return (
  //     <Stack>
  //       <h1>Entraste</h1>
  //     </Stack>
  //   );
  // }

  return (
    <Stack bgcolor={"white"} minHeight={"100vh"} alignItems={"center"} py={5}>
      <Stack
        width={{
          md: "80%",
          xs: "90%",
        }}
        alignItems={"center"}
      >
        <Box flexGrow={1} textAlign="center" justifyContent={'space-between'} display={'flex'}>
          <Box >
            <Image src={Imglogo} alt="logo" style={styleImg} objectFit="cover" />
          </Box>
          <Box p={2}>
            <Image src={ImageNetmask} alt="logo" style={styleImg} objectFit="cover" />
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
            />
          );
        })}
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
        >
          Enviar
        </Button>
      </Stack>
    </Stack>
  );
}
