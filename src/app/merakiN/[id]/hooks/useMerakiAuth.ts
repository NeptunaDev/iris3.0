import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";
import { APIResponse } from "@/lib/Shared/domain/response";
import { View, ViewUpdate, FormFieldType } from "@/lib/View/domain/View";
import { createViewFetchRepository } from "@/lib/View/infrastructure/ViewFetchRepository";
import { createViewService } from "@/lib/View/application/ViewService";
import { FormData } from "../interfaces";
import { inputs } from "../data";
import { useCautivePortalConnection } from "@/hooks/useCautivePortalConnection";
import { ViewSendEmail, ViewVerifyCode } from "@/lib/View/domain/ViewSpecification";

const mapTypeToFormFieldType = (type: string): FormFieldType => {
  switch (type) {
    case 'text': return 'text';
    case 'email': return 'email';
    case 'password': return 'password';
    case 'number': return 'number';
    case 'tel': return 'tel';
    case 'url': return 'url';
    case 'search': return 'search';
    case 'date': return 'date';
    case 'time': return 'time';
    case 'datetime-local': return 'datetime-local';
    case 'month': return 'month';
    case 'week': return 'week';
    case 'color': return 'color';
    case 'range': return 'range';
    case 'file': return 'file';
    case 'checkbox': return 'checkbox';
    case 'radio': return 'radio';
    case 'submit': return 'submit';
    case 'reset': return 'reset';
    case 'button': return 'button';
    case 'image': return 'image';
    case 'hidden': return 'hidden';
    case 'textarea': return 'textarea';
    case 'select': return 'select';
    default: return 'text';
  }
};

export const useMerakiAuth = (siteId: string) => {
  // State management
  const [isLogged, setIsLogged] = useState(false);
  const [isError, setIsError] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [otp, setOtp] = useState("");

  // URL and query parameters
  const queries = getQueriesStr(
    useSearchParams().toString().replaceAll("%3A", ":").replaceAll("%2F", "/")
  );
  const { base_grant_url } = queries;
  const url = base_grant_url + "?continue_url=" + "https://www.google.com/?hl=es";

  // Form data initialization
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

  // Use the generic hook for connection logic
  const { view, isError: connectionError, isLoading } = useCautivePortalConnection({
    siteId,
    clientMac: queries?.client_mac,
    nodeMac: queries?.node_mac,
  });

  // Event handlers
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

  const handleChangeSelect = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
      },
    }));
  };

  // View service initialization
  const viewRepository = createViewFetchRepository();
  const viewService = createViewService(viewRepository);

  // Mutations
  const { mutate: sendEmail } = useMutation<APIResponse<void>, Error, ViewSendEmail>({
    mutationFn: (viewSendEmail: ViewSendEmail) => viewService.sendEmail(viewSendEmail),
    onSuccess: () => setShowVerificationForm(true),
    onError: (error) => {
      console.error("Error sending email:", error);
      setIsError(true);
    },
  });

  const { mutate: updateView } = useMutation<APIResponse<View>, Error, ViewUpdate>({
    mutationFn: (viewUpdate: ViewUpdate) => {
      if (!view?.id) throw new Error("View ID is undefined");
      return viewService.update(view.id, viewUpdate);
    },
    onSuccess: () => {
      setIsLogged(true);
      window.location.href = url;
    },
    onError: (error) => {
      console.error("Error updating view:", error);
      setIsError(true);
    },
  });

  const { mutate: verifyCode } = useMutation<APIResponse<void>, Error, ViewVerifyCode>({
    mutationFn: (viewVerifyCode: ViewVerifyCode) => viewService.verifyCode(viewVerifyCode),
    onSuccess: () => {
      if (!view) {
        setIsError(true);
        return;
      }
      updateView({
        isLogin: true,
        info: [
          {
            label: "email",
            value: formData["Email"]?.value,
            type: "email"
          },
        ],
      });
    },
    onError: (error) => {
      console.error("Error verifying code:", error);
      setIsError(true);
    },
  });

  // Action handlers
  const handleSendEmail = () => {
    if (!view?.id) {
      setIsError(true);
      return;
    }
    if (formData["Email"]?.value) {
      sendEmail({
        viewId: view.id,
        template: "code_velez",
        email: formData["Email"].value,
      });
    }
  };

  const handleVerifyCode = () => {
    if (!view?.id) {
      setIsError(true);
      return;
    }
    if (otp) {
      verifyCode({
        code: otp,
        viewId: view.id,
      });
    }
  };

  const sendForm = async () => {
    if (!view?.id) {
      setIsError(true);
      console.error("Error: View ID is undefined");
      return;
    }

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
      updateView({
        isLogin: true,
        info: Object.values(formData).map(({ label, value, type }) => ({
          label,
          value,
          type: mapTypeToFormFieldType(type)
        })),
      });
    } catch (error) {
      console.error("Error sending form:", error);
      setIsError(true);
      alert('Hubo un error al enviar el formulario. Por favor, intente de nuevo.');
    }
  };

  return {
    formData,
    handleChange,
    handleChangeSelect,
    acceptedTerms,
    setAcceptedTerms,
    showVerificationForm,
    otp,
    handleChangeOtp: setOtp,
    handleSendEmail,
    handleVerifyCode,
    sendForm,
    isLogged,
    isError: isError || connectionError,
    isLoading,
  };
}; 