"use client";
import { Button, Checkbox, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { inputs } from "./data";
import { FormData } from "./interfaces";
import { Input } from "@/Components/Input/Input";
import theme from "../../theme/theme";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";

export default function Page() {
  const queries = getQueriesStr(
    useSearchParams().toString().replaceAll("%3A", ":").replaceAll("%2F", "/")
  );
  const { base_grant_url } = queries;
  const url = base_grant_url + "?continue_url=" + "https://google.com";
  console.log("🚀 ~ Page ~ url:", url);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState<FormData>(
    inputs.reduce(
      (acc, input) => ({
        ...acc,
        [input.label]: {
          label: input.label,
          type: input.type,
        },
      }),
      {}
    )
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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

  return (
    <form action={url} method="GET">
      <input type="text" />
      <input type="submit" value="Submit" />
    </form>
    // <Stack
    //   sx={{
    //     backgroundImage: `url(/velezdesktop.jpg)`,
    //     backgroundPosition: "center",
    //     height: "100vh",
    //     justifyContent: "center",
    //     backgroundSize: "cover",
    //     backgroundRepeat: "no-repeat",
    //     alignItems: "flex-end",
    //     "@media (max-width: 600px)": {
    //       backgroundImage: `url(/velezresponsive.jpg)`,
    //     },
    //   }}
    // >
    //   <Stack
    //     width={{
    //       md: "40%",
    //       xs: "90%",
    //     }}
    //     alignItems={"center"}
    //     justifyContent={"center"}
    //     sx={{
    //       padding: 4,
    //       borderRadius: 2,
    //       mt: { xs: '4rem' },
    //     }}
    //   >
    //     <Typography fontSize={"1.3REM"} fontWeight={500} color={"#fff"}>
    //       Te damos la Bienvenida!
    //     </Typography>
    //     {inputs.map((input, index) => {
    //       return (
    //         <Input
    //           handleChange={handleChange}
    //           key={index}
    //           label={input.label}
    //           type={input.type}
    //           placeholder={input?.placeholder}
    //           value={formData[input.label].value}
    //         />
    //       );
    //     })}
    //     <Stack direction="row" alignItems="center" spacing={1}>
    //       <Checkbox
    //         checked={acceptedTerms}
    //         onChange={(e) => setAcceptedTerms(e.target.checked)}
    //         sx={{
    //           color: "grey",
    //           "&.Mui-checked": {
    //             color: 'white',
    //           },
    //         }}
    //       />
    //       <Link
    //         href="https://www.ciscocolombia.co/pages/politica-de-privacidad"
    //         passHref
    //       >
    //         <Typography
    //           sx={{
    //             color: "#fff",
    //             textDecoration: "none",
    //             "&:hover": {
    //               color: "#2",
    //             },
    //           }}
    //         >
    //           Acepto terminos y condiciones descritos en este enlace
    //         </Typography>
    //       </Link>
    //     </Stack>
    //     <Button
    //       // onClick={sendForm}
    //       sx={{
    //         backgroundColor: theme.palette.primary.dark,
    //         color: "#fff",
    //         padding: "8px 16px",
    //         "&:hover": {
    //           backgroundColor: "#fff",
    //           color: theme.palette.primary.dark,
    //         },
    //         width: "200px",
    //       }}
    //       variant="contained"
    //       fullWidth
    //       // disabled={!acceptedTerms}
    //     >
    //       Conectarme!
    //     </Button>
    //   </Stack>
    // </Stack>
  );
}
