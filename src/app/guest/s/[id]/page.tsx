"use client";
import { Input } from "@/Components/Input/Input";
import { Button, SelectChangeEvent, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { inputs } from "./data";
import { SelectInput } from "@/Components/Input/SelectInput";
import { useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";

export default function PortalCautive({params} : {params: {id: string}}) {
  console.log(params.id)
  const queries = getQueriesStr(useSearchParams().toString()) 
  console.log("🚀 ~ PortalCautive ~ queries:", queries)
  const [formData, setFormData] = useState<{ [key: string]: string }>(
    inputs.reduce(
      (acc, input) => ({ ...acc, [input.label]: input?.options?.[0] || "" }),
      {}
    )
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeSelect = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
                value={formData[input.label]}
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
              value={formData[input.label]}
            />
          );
        })}
        <Button
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
