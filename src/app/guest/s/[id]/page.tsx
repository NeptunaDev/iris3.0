"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";

import { inputs } from "./data";

import { AP, Params, Site, View } from "./interfaces";
import { useFormData } from "./useFormData";
import { connectUser, createView, fetchAP, fetchSite, updateView } from "./apiUtils";
import { PortalCautive } from "./PortalCautiveView";

const PortalCautiveView: React.FC<Params> = ({ params }) => {
  const queries = getQueriesStr(useSearchParams().toString());
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [site, setSite] = useState<Site>({} as Site);
  const [ap, setAp] = useState<AP>({} as AP);
  const [view, setView] = useState<View>({} as View);
  const [isLogged, setIsLogged] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { formData, handleChange, handleChangeSelect } = useFormData(inputs);

  useEffect(() => {
    fetchSite(params.id)
      .then(setSite)
      .catch(() => setIsError(true));
  }, [params.id]);

  useEffect(() => {
    if (!site?._id || !queries?.ap) return;
    fetchAP(site._id, queries.ap.replaceAll("%3A", ":"))
      .then(setAp)
      .catch(() => setIsError(true));
  }, [queries?.ap, site._id]);

  useEffect(() => {
    if (!ap?._id || !queries?.id || view?._id) return;
    createView(ap._id, queries.id.replaceAll("%3A", ":"))
      .then(setView)
      .catch(() => setIsError(true));
  }, [queries?.id, view._id, ap._id]);

  const sendForm = async () => {
    if (!acceptedTerms) {
      alert('Por favor, acepte los términos y condiciones.');
      return;
    }

    const hasErrors = Object.values(formData).some((field) => field.error !== "");
    if (hasErrors) {
      alert('Por favor, corrija los errores en el formulario antes de enviar.');
      return;
    }

    try {
      await connectUser({
        id: queries.id.replaceAll("%3A", ":"),
        ap: queries.ap.replaceAll("%3A", ":"),
        site: params.id,
        idSite: site._id,
      });

      await updateView(view._id, Object.values(formData));

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