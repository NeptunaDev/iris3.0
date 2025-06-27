import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";
import { FormData, AP, Site, View } from "../interfaces";
import { inputs } from "../data";
import { validateField } from "../validations";

export const useMerakiAuth = (siteId: string) => {
  const searchParams = useSearchParams().toString();

  // Limpiar caracteres URL-encoded de todos los parámetros
  const cleanParams = searchParams
    .replaceAll("%3A", ":")
    .replaceAll("%2F", "/");
  const queries = getQueriesStr(cleanParams);

  // Extraer y limpiar todos los parámetros necesarios de Meraki
  const {
    base_grant_url,
    user_continue_url,
    node_mac,
    client_mac,
    client_ip,
    gateway_id,
    node_id,
  } = queries;

  // Aplicar limpieza adicional a parámetros específicos si es necesario
  const cleanBaseGrantUrl = base_grant_url
    ?.replaceAll("%3A", ":")
    .replaceAll("%2F", "/");
  const cleanUserContinueUrl = user_continue_url
    ?.replaceAll("%3A", ":")
    .replaceAll("%2F", "/");
  const cleanNodeMac = node_mac?.replaceAll("%3A", ":").replaceAll("%2F", "/");
  const cleanClientMac = client_mac
    ?.replaceAll("%3A", ":")
    .replaceAll("%2F", "/");

  const [isLogin, setIsLogin] = useState(false);
  const [ap, setAp] = useState<AP>({} as AP);
  const [isError, setIsError] = useState<boolean>(false);
  const [view, setView] = useState<View>({} as View);
  const [site, setSite] = useState<Site>({} as Site);
  const [formData, setFormData] = useState<FormData>(
    inputs.reduce(
      (acc, input) => ({
        ...acc,
        [input.label]: {
          label: input.label,
          type: input.type,
          value: "",
          error: "",
          errorMessage: "",
        },
      }),
      {}
    )
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [authStep, setAuthStep] = useState<
    "form" | "authenticating" | "complete"
  >("form");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Obtener el tipo de campo para la validación
    const fieldType = inputs.find(input => input.label === name)?.type || "text";
    
    // Aplicar validación
    const error = validateField(value, fieldType);
    
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error,
      },
    }));
  };

  const handleChangeSelect = (name: string, value: string) => {
    // Obtener el tipo de campo para la validación
    const fieldType = inputs.find(input => input.label === name)?.type || "text";
    
    // Aplicar validación
    const error = validateField(value, fieldType);
    
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error,
      },
    }));
  };

  // Validar que tenemos los parámetros necesarios de Meraki
  useEffect(() => {
    if (!cleanBaseGrantUrl || !cleanClientMac) {
      console.error("Faltan parámetros críticos de Meraki:", {
        base_grant_url: !!cleanBaseGrantUrl,
        client_mac: !!cleanClientMac,
        node_mac: !!cleanNodeMac,
        user_continue_url: !!cleanUserContinueUrl,
      });
      setIsError(true);
    }
  }, [cleanBaseGrantUrl, cleanNodeMac, cleanClientMac, cleanUserContinueUrl]);

  // Fetch site data
  useEffect(() => {
    async function fetchUbiquitiData() {
      const endpoint = `https://api-iris-0yax.onrender.com/api/v1/ubiquiti/site?siteId=${siteId}`;
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSite(data.data);
        return data;
      } catch (error) {
        setIsError(true);
        console.error("Error fetching data:", error);
      }
    }

    fetchUbiquitiData();
  }, [siteId]);

  // Fetch AP data
  useEffect(() => {
    if (!site?._id) return;
    if (!cleanNodeMac) {
      setIsError(true);
      return;
    }

    const getData = async () => {
      try {
        const response = await fetch(
          `https://api-iris-0yax.onrender.com/api/v1/ubiquiti/ap?idSite=${site._id}&mac=${cleanNodeMac}`,
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
  }, [cleanNodeMac, site._id]);

  // Create view
  useEffect(() => {
    if (!ap?._id) return;
    if (!cleanClientMac) {
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
            mac: cleanClientMac,
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
  }, [cleanClientMac, view._id, ap._id]);

  const sendForm = async () => {
    if (!acceptedTerms) {
      alert("Por favor, acepte los términos y condiciones.");
      return;
    }

    // Validar todos los campos antes de enviar
    const updatedFormData = { ...formData };
    let hasValidationErrors = false;

    Object.keys(formData).forEach((fieldName) => {
      const field = formData[fieldName];
      const fieldType = inputs.find(input => input.label === fieldName)?.type || "text";
      const error = validateField(field.value, fieldType);
      
      updatedFormData[fieldName] = {
        ...field,
        error,
      };
      
      if (error) {
        hasValidationErrors = true;
      }
    });

    // Actualizar el estado con los errores de validación
    setFormData(updatedFormData);

    if (hasValidationErrors) {
      alert("Por favor, corrija los errores en el formulario antes de enviar.");
      return;
    }

    const { _id } = view;
    const hasErrors = Object.values(formData).some(
      (field) => field.error !== ""
    );
    if (hasErrors) {
      alert("Por favor, corrija los errores en el formulario antes de enviar.");
      return;
    }

    // Validación principal: parámetros de Meraki (usando versiones limpias)
    if (!cleanBaseGrantUrl) {
      alert("Error: No se encontró la URL de autenticación de Meraki.");
      console.error("base_grant_url faltante:", { cleanBaseGrantUrl, queries });
      return;
    }

    if (!cleanClientMac) {
      alert("Error: No se encontró la MAC del cliente.");
      console.error("client_mac faltante:", { cleanClientMac, queries });
      return;
    }

    try {
      setAuthStep("authenticating");
      await fetch(`/api/view`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: _id,
          isLogin: true,
          info: [
            {
              label: "email",
              value: formData["Email"].value,
              type: "email",
            },
          ],
        }),
      });
      setIsLogin(true);
      const continueUrl = cleanUserContinueUrl || "https://www.netmask.co/";
      const grantUrl = `${cleanBaseGrantUrl}?continue_url=${continueUrl}`;
      window.location.href = grantUrl;
    } catch (error) {
      console.error("Error en autenticación:", error);
      setIsError(true);
      setAuthStep("form");
      alert("Error al procesar la autenticación. Por favor, intente de nuevo.");
    }
  };

  return {
    formData,
    handleChange,
    handleChangeSelect,
    acceptedTerms,
    setAcceptedTerms,
    sendForm,
    isLogin,
    isError,
    isLoading: authStep === "authenticating",
    authStep,
    merakiParams: {
      base_grant_url: cleanBaseGrantUrl,
      user_continue_url: cleanUserContinueUrl,
      node_mac: cleanNodeMac,
      client_mac: cleanClientMac,
      client_ip,
      gateway_id,
      node_id,
      hasValidParams: !!(cleanBaseGrantUrl && cleanClientMac),
    },
  };
};
