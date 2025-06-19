import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getQueriesStr } from "@/utils/api/request/getQueries";
import { APIResponse } from "@/lib/Shared/domain/response";
import { Site } from "@/lib/Site/domain/Site";
import { AP } from "@/lib/AP/domain/AP";
import { View, ViewCreate } from "@/lib/View/domain/View";
import { createSiteFetchRepository } from "@/lib/Site/infrastructure/SiteFetchRepository";
import { createSiteService } from "@/lib/Site/application/SiteUseCase";
import { createAPFetchRepository } from "@/lib/AP/infrastructure/APFetchRepository";
import { createAPService } from "@/lib/AP/application/APUseCase";
import { createViewFetchRepository } from "@/lib/View/infrastructure/ViewFetchRepository";
import { createViewService } from "@/lib/View/application/ViewService";

interface UseCautivePortalConnectionProps {
  siteId: string;
  clientMac?: string;
  nodeMac?: string;
}

interface UseCautivePortalConnectionResult {
  site: Site | undefined;
  ap: AP | undefined;
  view: View | undefined;
  isError: boolean;
  isLoading: boolean;
}

export const useCautivePortalConnection = ({
  siteId,
  clientMac,
  nodeMac,
}: UseCautivePortalConnectionProps): UseCautivePortalConnectionResult => {
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
  const [isError, setIsError] = useState(false);

  // Queries
  const { data: siteResponse, isLoading: isLoadingSite } = useQuery<APIResponse<Site[]>, Error>({
    queryKey: ["Site", siteId],
    queryFn: async () => {
      const response = await siteService.find({ siteId });
      return response as APIResponse<Site[]>;
    },
    enabled: !!siteId,
  });

  const { data: apResponse, isLoading: isLoadingAP } = useQuery<APIResponse<AP[]>, Error>({
    queryKey: ["AP", site?.id, nodeMac],
    queryFn: async () => {
      const response = await apService.find({ 
        idSite: site?.id, 
        mac: nodeMac 
      });
      return response as APIResponse<AP[]>;
    },
    enabled: !!site?.id && !!nodeMac
  });

  const { mutate: createView, isPending: isCreatingView } = useMutation<APIResponse<View>, Error, ViewCreate>({
    mutationFn: (view: ViewCreate) => viewService.create(view),
    onSuccess: (data) => setView(data.data),
    onError: (error) => {
      console.error("Error creating view:", error);
      setIsError(true);
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
    const mac = clientMac;
    if (mac && ap?.id) {
      createView({
        idAp: ap.id,
        mac: mac,
      });
    }
  }, [clientMac, ap?.id]);

  return {
    site,
    ap,
    view,
    isError,
    isLoading: isLoadingSite || isLoadingAP || isCreatingView,
  };
}; 