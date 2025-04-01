"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { FormData, Params } from "./interfaces";
import { inputs } from "./data";
import { APIResponse } from "@/lib/Shared/domain/response";
import { Site } from "@/lib/Site/domain/Site";
import { createSiteFetchRepository } from "@/lib/Site/infrastructure/SiteFetchRepository";
import { getQueriesStr } from "@/utils/api/request/getQueries";

import { Input } from "@/Components/Input/Input";
import { createSiteService } from "@/lib/Site/application/SiteUseCase";
import { createAPFetchRepository } from "@/lib/AP/infrastructure/APFetchRepository";
import { createAPService } from "@/lib/AP/application/APUseCase";
import { AP } from "@/lib/AP/domain/AP";
import { View } from "@/lib/View/domain/View";

const MuiOtpInputStyled = styled(MuiOtpInput)`
  display: flex;
  gap: 30px;
  max-width: 600px;
  margin-inline: auto;
  .MuiOtpInput-TextField {
    background-color: white; /* Estilo para que cada cuadro sea blanco */
  }
`;

export default function Page({ params }: Params) {
  // Logic with Hexagonal Architecture
  const siteRepository = createSiteFetchRepository();
  const siteService = createSiteService(siteRepository);

  const apRepository = createAPFetchRepository();
  const apService = createAPService(apRepository);


  const queries = getQueriesStr(
    useSearchParams().toString().replaceAll("%3A", ":").replaceAll("%2F", "/")
  );
  const { base_grant_url } = queries;
  const url = base_grant_url + "?continue_url=" + "https://www.velez.com.co/";
  const [site, setSite] = useState<Site | undefined>(undefined);
  const [ap, setAp] = useState<AP | undefined>(undefined);

  const [isLogged, setIsLogged] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [view, setView] = useState<View | undefined>(undefined);
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
  const [otp, setOtp] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("Código")) {
      setOtp((prevOtp) => prevOtp + value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
        },
      }));
    }
  };

  const handleChangeOtp = (otp: string) => {
    setOtp(otp);
  };

  // Management of the site data
  const { data: siteResponse, isLoading: isLoadingSite, error: errorSite } = useQuery<APIResponse<Site[]>, Error>({
    queryKey: ["Site", params.id],
    queryFn: () => siteService.find({ siteId: params.id }),
    enabled: !!params.id,
  });
  useEffect(() => {
    const siteData = siteResponse?.data?.[0];
    if (!siteData) {
      return;
    }
    setSite(siteData);
  }, [siteResponse]);

  // Management of the AP data
  const { data: apResponse, isLoading: isLoadingAP, error: errorAP } = useQuery<APIResponse<AP[]>, Error>({
    queryKey: ["AP", site?.id, queries?.node_mac],
    queryFn: () => apService.find({ idSite: site?.id, mac: queries?.node_mac }),
    enabled: !!site?.id && !!queries?.node_mac
  })
  useEffect(() => {
    const apData = apResponse?.data?.[0];
    if (!apData) {
      return;
    }
    setAp(apData);
  }, [apResponse]);

  const handleSendEmail = async () => {
    if (!view) return;
    const { id } = view;
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
          id_view: id,
          template: "code_velez",
          email: email,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      setShowVerificationForm(true);
    } catch (error: any) {
      console.log("error", error.message);
    }
  };

  const handleVerifyCode = async () => {
    if (!view) return;
    const { id } = view;
    const code = otp;
    const email = formData["Email"]?.value;
    if (!email) {
      console.error("Email is not defined");
      return;
    }
    try {
      const response = await fetch("/api/view/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          id_view: id,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      await fetch(`/api/view`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          isLogin: true,
          info: [
            {
              label: "email",
              value: email,
              type: "email",
            },
          ],
        }),
      });

      setIsLogged(true);
      window.location.href = url;
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
            mt: { xs: "7rem" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!showVerificationForm ? (
            <>
              <Typography
                fontSize={"1.3REM"}
                fontWeight={"bold"}
                color={"#fff"}
              >
                Te damos la bienvenida
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
                    Acepto términos y condiciones descritos en este enlace
                  </Typography>
                </Link>
              </Stack>
              <Button
                onClick={handleSendEmail}
                sx={{
                  backgroundColor: "#4D4D4D !important",
                  color: "#fff",
                  padding: "8px 16px",
                  width: "200px",
                  textTransform: "none",
                }}
                variant="contained"
                fullWidth
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
              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: "10px",
                  color: "red",
                }}
              >
                <MuiOtpInputStyled
                  value={otp}
                  onChange={handleChangeOtp}
                  length={6}
                  sx={{}}
                />
              </Stack>
              <Button
                onClick={handleVerifyCode}
                sx={{
                  backgroundColor: "#4D4D4D !important",
                  color: "#fff",
                  padding: "8px 16px",
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
