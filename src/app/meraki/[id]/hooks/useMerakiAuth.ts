import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";
import { APIResponse } from "@/lib/Shared/domain/response";
import { View, ViewUpdate } from "@/lib/View/domain/View";
import { createViewFetchRepository } from "@/lib/View/infrastructure/ViewFetchRepository";
import { createViewService } from "@/lib/View/application/ViewService";
import { FormData } from "../interfaces";
import { inputs } from "../data";
import { useCautivePortalConnection } from "@/hooks/useCautivePortalConnection";
import { ViewSendEmail, ViewVerifyCode } from "@/lib/View/domain/ViewSpecification";

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
  const url = base_grant_url + "?continue_url=" + "https://www.velez.com.co/";

  // Form data initialization
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

  // Use the generic hook for connection logic
  const { view, isError: connectionError } = useCautivePortalConnection({
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

  const handleChangeOtp = (otp: string) => setOtp(otp);

  // View service initialization
  const viewRepository = createViewFetchRepository();
  const viewService = createViewService(viewRepository);

  // Mutations
  const { mutate: sendEmail } = useMutation<APIResponse<void>, Error, ViewSendEmail>({
    mutationFn: (viewSendEmail: ViewSendEmail) => viewService.sendEmail(viewSendEmail),
    onSuccess: () => setShowVerificationForm(true),
    onError: (error) => console.error("Error sending email:", error),
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
  });

  const { mutate: verifyCode } = useMutation<APIResponse<void>, Error, ViewVerifyCode>({
    mutationFn: (viewVerifyCode: ViewVerifyCode) => viewService.verifyCode(viewVerifyCode),
    onSuccess: () => {
      if (!view) return;
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
  });

  // Action handlers
  const handleSendEmail = () => {
    if (view?.id && formData["Email"]?.value) {
      sendEmail({
        viewId: view.id,
        template: "code_velez",
        email: formData["Email"].value,
      });
    }
  };

  const handleVerifyCode = () => {
    if (view?.id && otp) {
      verifyCode({
        code: otp,
        viewId: view.id,
      });
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
    isError: isError || connectionError,
  };
}; 