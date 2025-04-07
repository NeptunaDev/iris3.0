"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";

import { inputs } from "./data";

import { AP, Params, Site, View } from "./interfaces";
import { useFormData } from "./useFormData";
import { connectUser, createView, fetchAP, fetchSite, updateView } from "./apiUtils";
import { PortalCautive } from "./PortalCautiveView";
import { useCautivePortalConnection } from "@/hooks/useCautivePortalConnection";

const PortalCautiveView: React.FC<Params> = ({ params }) => {
  const queries = getQueriesStr(useSearchParams().toString().replaceAll("%3A", ":").replaceAll("%2F", "/"));
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { formData, handleChange, handleChangeSelect } = useFormData(inputs);

  // Use the generic hook for connection logic
  const {site, view, isError: connectionError } = useCautivePortalConnection({
    siteId: params.id,
    clientMac: queries.id,
    nodeMac: queries.ap,
  });

  const sendForm = async () => {
    if (!acceptedTerms) {
      alert('Por favor, acepte los términos y condiciones.');
      return;
    }

    if (!site?.id || !view?.id) return;

    const hasErrors = Object.values(formData).some((field) => field.error !== "");
    if (hasErrors) {
      alert('Por favor, corrija los errores en el formulario antes de enviar.');
      return;
    }

    try {
      await connectUser({
        id: queries.id,
        ap: queries.ap,
        site: params.id,
        idSite: site?.id,
      });

      await updateView(view.id, Object.values(formData));

      setIsLogged(true);
      router.push("https://www.google.com/?hl=es");
    } catch (error) {
      console.error("Error sending form:", error);
      alert('Hubo un error al enviar el formulario. Por favor, intente de nuevo.');
    }
  };

  if (isError) {
    return <h1>Hubo un error</h1>;
  }

  return (
    <PortalCautive
      formData={formData}
      handleChange={handleChange}
      handleChangeSelect={handleChangeSelect}
      acceptedTerms={acceptedTerms}
      setAcceptedTerms={setAcceptedTerms}
      sendForm={sendForm}
    />
  );
}

export default PortalCautiveView;