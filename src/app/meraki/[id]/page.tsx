"use client";
import { Button, Checkbox, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { inputs } from "./data";
import { AP, FormData, Params, Site, View } from "./interfaces";
import { Input } from "@/Components/Input/Input";
import theme from "../../theme/theme";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";
import { any } from "joi";

export default function Page({ params }: Params) {
  const queries = getQueriesStr(
    useSearchParams().toString().replaceAll("%3A", ":").replaceAll("%2F", "/")
  );
  const { base_grant_url } = queries;
  const url = base_grant_url + "?continue_url=" + "https://google.com";
  const [isLogged, setIsLogged] = useState(false);
  const [ap, setAp] = useState<AP>({} as AP);
  const [isError, setIsError] = useState<boolean>(false);
  const [view, setView] = useState<View>({} as View);
  console.log("🚀 ~ Page ~ view:", view);
  const [site, setSite] = useState<Site>({} as Site);
  const [formData, setFormData] = useState<FormData>(
    inputs.reduce(
      (acc, input) => ({
        ...acc,
        [input.label]: {
          label: input.label,
          type: input.type,
          value: "",
        },
      }),
      {}
    )
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
      },
    }));
  };

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

  useEffect(() => {
    if (!site?._id) return;
    if (!queries?.node_mac) {
      setIsError(true);
      return;
    }

    const getData = async () => {
      try {
        const response = await fetch(
          `https://api-iris-0yax.onrender.com/api/v1/ubiquiti/ap?idSite=${
            site._id
          }&mac=${queries.node_mac
            .replaceAll("%3A", ":")
            .replaceAll("%2F", "/")}`,
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
  }, [queries?.node_mac, site._id]);

  useEffect(() => {
    if (!ap?._id) return;
    if (!queries?.client_mac) {
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
            mac: queries?.client_mac
              .replaceAll("%3A", ":")
              .replaceAll("%2F", "/"),
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
  }, [queries?.client_mac, view._id, ap._id]);

  const handleSendEmail = async () => {
    const { _id } = view;
    const email = formData["Email"]?.value;
    if (!email) {
      console.error("Email is not defined");
      return;
    }
    try {
      const response = await fetch("/api/communication/email-by-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_view: _id,
          template: "code_velez",
          email: email,
        }),
      });

      const data = await response.json();
      console.log("🚀 ~ handleSendEmail ~ data:", data)

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      // setShowVerificationForm(true);
    } catch (error: any) {
      console.log("error", error.message);
    }
  };

  const handleVerifyCode = async () => {
    const { _id } = view;
    try {
      const response = await fetch("/view/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: "547395",
          id_view: _id,
        }),
      });
      const data = await response.json();

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Stack
        sx={{
          backgroundImage: `url(/velezdesktop.jpg)`,
          backgroundPosition: "center",
          height: "100vh",
          justifyContent: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          alignItems: "flex-end",
          "@media (max-width: 600px)": {
            backgroundImage: `url(/velezresponsive.jpg)`,
          },
        }}
      >
        <Stack
          width={{
            md: "40%",
            xs: "90%",
          }}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            padding: 4,
            borderRadius: 2,
            mt: { xs: "4rem" },
          }}
        >
          {!showVerificationForm ? (
            <>
              <Typography
                fontSize={"1.3REM"}
                fontWeight={"bold"}
                color={"#fff"}
              >
                Te damos la bienvenida!
              </Typography>
              {inputs.map((input, index) => {
                return (
                  <Input
                    handleChange={handleChange}
                    key={index}
                    label={input.label}
                    type={input.type}
                    placeholder={input?.placeholder}
                    value={formData[input.label].value}
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      width: { md: "400px", xs: "300px" },
                    }}
                  />
                );
              })}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  sx={{
                    color: "grey",
                    "&.Mui-checked": {
                      color: "white",
                    },
                  }}
                />
                <Link
                  href="https://www.ciscocolombia.co/pages/politica-de-privacidad"
                  passHref
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#2",
                      },
                    }}
                  >
                    Acepto terminos y condiciones descritos en este enlace
                  </Typography>
                </Link>
              </Stack>
              <Button
                onClick={handleSendEmail}
                sx={{
                  backgroundColor: theme.palette.primary.dark,
                  color: "#fff",
                  padding: "8px 16px",
                  "&:hover": {
                    backgroundColor: "#fff",
                    color: theme.palette.primary.dark,
                  },
                  width: "200px",
                }}
                variant="contained"
                fullWidth
                // disabled={!acceptedTerms}
                //debe validar el email para que se le envie el codigo que debe ingresar
              >
                Conectarme!
              </Button>
            </>
          ) : (
            <>
              <Typography
                fontSize={"1.3REM"}
                fontWeight={"bold"}
                color={"#fff"}
              >
                Introduce tu código de verificación
              </Typography>
              {["Código 1", "Código 2", "Código 3", "Código 4"].map(
                (label, index) => (
                  <Input
                    handleChange={handleChange}
                    key={index}
                    label={label}
                    type="text"
                    placeholder={`Ingrese ${label.toLowerCase()}`}
                    value={formData[label]?.value || ""}
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      width: { md: "400px", xs: "300px" },
                    }}
                  />
                )
              )}
              <Button
                onClick={handleVerifyCode}
                sx={{
                  backgroundColor: theme.palette.primary.dark,
                  color: "#fff",
                  padding: "8px 16px",
                  "&:hover": {
                    backgroundColor: "#fff",
                    color: theme.palette.primary.dark,
                  },
                  width: "200px",
                }}
                variant="contained"
                fullWidth
              >
                Verificar
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </>
  );
}
