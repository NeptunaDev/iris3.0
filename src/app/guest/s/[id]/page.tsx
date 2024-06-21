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
import Image from "next/image";
import ImageNetmask from "../../../../../public/netmask.png";
import Imglogo from "../../../../../public/ecorza.png";
import theme from "@/app/theme/theme";
import { error } from "console";

const styleImg = {
  width: "100%",
  height: "100%",
};

interface FormData {
  [key: string]: {
    label: string;
    value: string;
    type: string;
  };
}

interface Params {
  params: {
    id: string;
  };
}

interface Site {
  _id: string;
  idOrganization: string;
  type: "ubiquiti" | "meraki";
  siteId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface AP {
  _id: string;
  idSite: string;
  mac: string;
  createdAt: string;
  updatedAt: string;
}

interface View {
  idAp: string;
  mac: string;
  isLogin: boolean;
  info: [];
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export default function PortalCautive({ params }: Params) {
  const queries = getQueriesStr(useSearchParams().toString());
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [site, setSite] = useState<Site>({} as Site);
  const [ap, setAp] = useState<AP>({} as AP);
  const [view, setView] = useState<View>({} as View);

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
        idSite: site._id,
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

  // Fetch site
  useEffect(() => {
    async function fetchUbiquitiData() {
      const endpoint = `https://api-iris-0yax.onrender.com/api/v1/ubiquiti/site?siteId=${params.id}`;
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSite(data.data);
        return data;
      } catch (error) {
        // Problem found site, show page of error
        setIsError(true);
        console.error("Error fetching data:", error);
      }
    }

    fetchUbiquitiData();
  }, [params.id]);

  // Fetch ap
  useEffect(() => {
    if (!site?._id) return;
    if (!queries?.ap) {
      setIsError(true);
      return;
    }

    const getData = async () => {
      try {
        const response = await fetch(
          `https://api-iris-0yax.onrender.com/api/v1/ubiquiti/ap?idSite=${
            site._id
          }&mac=${queries.ap.replaceAll("%3A", ":")}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAp(data.data);
      } catch (error) {
        setIsError(true);
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [queries?.ap, site._id]);

  useEffect(() => {
    if (!ap?._id) return;
    if (!queries?.id) {
      setIsError(true);
      return;
    }
    if (view?._id) {
      return;
    }

    const createView = async () => {
      try {
        const response = await fetch(`/api/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idAp: ap?._id,
            mac: queries?.id.replaceAll("%3A", ":"),
          }),
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setView(() => ({ ...data.data }));
      } catch (error) {
        setIsError(true);
        console.error("Error fetching data:", error);
      }
    };

    createView();
  }, [queries?.id, view._id, ap._id]);

  if (isError) {
    return (
      <Stack>
        <h1>Hubo un error</h1>
      </Stack>
    );
  }

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
