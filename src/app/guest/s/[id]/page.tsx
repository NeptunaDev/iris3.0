"use client";
import { Input } from "@/Components/Input/Input";
import { Button, SelectChangeEvent, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { inputs } from "./data";
import { SelectInput } from "@/Components/Input/SelectInput";
import { useRouter, useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";
import { Controller } from "@/models/Controller.model";

export default function PortalCautive({ params }: { params: { id: string } }) {
  console.log(params.id);
  const queries = getQueriesStr(useSearchParams().toString());
  console.log("🚀 ~ PortalCautive ~ queries:", queries);
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
    if(!response.ok){
      // No actualizo cliente
      return;
    }
    setIsLogged(true)
    router.push("https://www.google.com/?hl=es")
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

  if (isLogged){
    return (
      <Stack>
        <h1>Entraste</h1>
      </Stack>
    )
  }

  return (
    <Stack bgcolor={"#333"} minHeight={"100vh"} alignItems={"center"} py={5}>
      <Stack
        width={{
          md: "80%",
          xs: "90%",
        }}
      >
        <Typography fontSize={"2REM"} fontWeight={700} color={"#CCCCCC"}>
          Netmask
        </Typography>
        <Typography fontSize={"1.3REM"} fontWeight={500} color={"#CCCCCC"}>
          Bienvenido al WIFI
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
            backgroundColor: "#CD9A32",
            color: "#333",
            padding: "8px 16px",
            "&:hover": {
              backgroundColor: "#CD9A32",
              color: "#333",
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
