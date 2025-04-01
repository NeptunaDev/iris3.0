import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";
import { APIResponse } from "@/lib/Shared/domain/response";
import { Site } from "@/lib/Site/domain/Site";
import { AP } from "@/lib/AP/domain/AP";
import { View, ViewCreate, ViewUpdate } from "@/lib/View/domain/View";
import { ViewSendEmail, ViewVerifyCode } from "@/lib/View/domain/ViewRepository";
import { createSiteFetchRepository } from "@/lib/Site/infrastructure/SiteFetchRepository";
import { createSiteService } from "@/lib/Site/application/SiteUseCase";
import { createAPFetchRepository } from "@/lib/AP/infrastructure/APFetchRepository";
import { createAPService } from "@/lib/AP/application/APUseCase";
import { createViewFetchRepository } from "@/lib/View/infrastructure/ViewFetchRepository";
import { createViewService } from "@/lib/View/application/ViewService";
import { FormData } from "../interfaces";
import { inputs } from "../data";

export const useMerakiAuth = (siteId: string) => {
  // Services initialization
  const siteRepository = createSiteFetchRepository();
  const siteService = createSiteService(siteRepository);
  const apRepository = createAPFetchRepository();
  const apService = createAPService(apRepository);
  const viewRepository = createViewFetchRepository();
  const viewService = createViewService(viewRepository);

  // State management
  const [site, setSite] = useState<Site>();
  const [ap, setAp] = useState<AP>();
  const [view, setView] = useState<View>();
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

  // Queries and Mutations
  const { data: siteResponse } = useQuery<APIResponse<Site[]>, Error>({
    queryKey: ["Site", siteId],
    queryFn: () => siteService.find({ siteId }),
    enabled: !!siteId,
  });

  const { data: apResponse } = useQuery<APIResponse<AP[]>, Error>({
    queryKey: ["AP", site?.id, queries?.node_mac],
    queryFn: () => apService.find({ idSite: site?.id, mac: queries?.node_mac }),
    enabled: !!site?.id && !!queries?.node_mac
  });

  const { mutate: createView } = useMutation<APIResponse<View>, Error, ViewCreate>({
    mutationFn: (view: ViewCreate) => viewService.create(view),
    onSuccess: (data) => setView(data.data),
    onError: (error) => console.error("Error creating view:", error),
  });

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

  // Effects
  useEffect(() => {
    if (siteResponse?.data?.[0]) {
      setSite(siteResponse.data[0]);
    }
  }, [siteResponse]);

  useEffect(() => {
    if (apResponse?.data?.[0]) {
      setAp(apResponse.data[0]);
    }
  }, [apResponse]);

  useEffect(() => {
    if (queries?.client_mac && ap?.id) {
      createView({
        idAp: ap.id,
        mac: queries.client_mac.replaceAll("%3A", ":").replaceAll("%2F", "/"),
      });
    }
  }, [queries?.client_mac, ap?.id]);

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
    isError,
  };
}; 