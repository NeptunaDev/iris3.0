"use client";
import { Input } from "@/Components/Input/Input";
import { Button, SelectChangeEvent, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { inputs } from "./data";
import { SelectInput } from "@/Components/Input/SelectInput";
import { useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";
import { Controller } from "@/models/Controller.model";

export default function PortalCautive({ params }: { params: { id: string } }) {
  console.log(params.id);
  const queries = getQueriesStr(useSearchParams().toString())
  console.log("🚀 ~ PortalCautive ~ queries:", queries)

  return (
    <Stack>

    <form action="/connecting" method="POST">
              <h2>Iniciar Sesión</h2>
              <label htmlFor="email">Correo Electrónico:</label>
              <input type="email" id="email" name="email" required />
              <label htmlFor="password">Contraseña:</label>
              <input type="password" id="password" name="password" required />
              <input type="text" defaultValue={queries?.ap.replaceAll('%3A', ':')} id="ap" name = "ap" />
              <input type="text" defaultValue={queries?.id.replaceAll('%3A', ':')} id="id" name = "id" />
              <input type="text" defaultValue={params.id} id="id" name = "site" />
              <input type="submit" value="Iniciar Sesión" />
          </form>
    </Stack>
  );
}
