import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";
import { FormData } from "../interfaces";
import { inputs } from "../data";

const CONTINUE_URL = "https://www.velez.com.co/";

export const useMerakiAuth = (siteId: string) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isError, setIsError] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [view, setView] = useState<{ id: string } | null>(null);

  const queries = getQueriesStr(
    useSearchParams().toString().replaceAll("%3A", ":").replaceAll("%2F", "/")
  );
  const clientMac = queries?.client_mac;
  const nodeMac = queries?.node_mac;
  const baseGrantUrl = queries?.base_grant_url;
  const url = baseGrantUrl ? `${baseGrantUrl}?continue_url=${encodeURIComponent(CONTINUE_URL)}` : "";

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

  // 1) Obtener sitio por siteId (API local, sin JWT)
  const [site, setSite] = useState<{ _id: string } | null>(null);
  useEffect(() => {
    if (!siteId) return;
    fetch(`/api/ubiquiti?type=SITE&siteId=${encodeURIComponent(siteId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Site not found");
        return res.json();
      })
      .then((data) => setSite(data.data))
      .catch(() => setIsError(true));
  }, [siteId]);

  // 2) Obtener AP por idSite + mac
  const [ap, setAp] = useState<{ _id: string } | null>(null);
  useEffect(() => {
    if (!site?._id || !nodeMac) return;
    fetch(
      `/api/ubiquiti?type=AP&idSite=${encodeURIComponent(site._id)}&mac=${encodeURIComponent(nodeMac)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("AP not found");
        return res.json();
      })
      .then((data) => setAp(data.data))
      .catch(() => setIsError(true));
  }, [site?._id, nodeMac]);

  // 3) Crear vista cuando tengamos AP y clientMac
  useEffect(() => {
    if (!ap?._id || !clientMac || view) return;
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idAp: ap._id, mac: clientMac }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create view");
        return res.json();
      })
      .then((data) => setView(data.data))
      .catch(() => setIsError(true));
  }, [ap?._id, clientMac, view]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("Código")) {
      setOtp((prev) => prev + value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: { ...prev[name], value },
      }));
    }
  };

  const handleChangeOtp = (otp: string) => setOtp(otp);

  // Enviar email con código (API local)
  const { mutate: sendEmail, isPending: isSendingEmail } = useMutation({
    mutationFn: async (payload: { id_view: string; template: string; email: string }) => {
      const res = await fetch("/api/communication/email-by-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send email");
    },
    onSuccess: () => setShowVerificationForm(true),
    onError: () => setIsError(true),
  });

  // Verificar código y marcar vista como login (API local)
  const { mutate: verifyCode, isPending: isVerifying } = useMutation({
    mutationFn: async (payload: { code: string; id_view: string }) => {
      const res = await fetch("/api/view/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Invalid code");
    },
    onSuccess: async () => {
      if (!view?.id || !formData["Email"]?.value) return;
      await fetch("/api/view", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: view.id,
          isLogin: true,
          info: [
            { label: "email", value: formData["Email"].value, type: "email" },
          ],
        }),
      });
      setIsLogged(true);
      if (url) window.location.href = url;
    },
    onError: () => setIsError(true),
  });

  const handleSendEmail = () => {
    if (view?.id && formData["Email"]?.value) {
      sendEmail({
        id_view: view.id,
        template: "code_velez",
        email: formData["Email"].value,
      });
    }
  };

  const handleVerifyCode = () => {
    if (view?.id && otp) {
      verifyCode({ code: otp, id_view: view.id });
    }
  };

  return {
    formData,
    handleChange,
    acceptedTerms,
    setAcceptedTerms,
    showVerificationForm,
    otp,
    handleChangeOtp,
    handleSendEmail,
    handleVerifyCode,
    isLogged,
    isError,
    isLoading: isSendingEmail || isVerifying,
  };
};
