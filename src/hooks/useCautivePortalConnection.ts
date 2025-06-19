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
  // Log initial parameters
  console.log("🚀 useCautivePortalConnection called with:", { siteId, clientMac, nodeMac });

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
      console.log("🔍 Searching for site:", siteId);
      const response = await siteService.find({ siteId });
      console.log("📡 Site response:", response);
      return response as APIResponse<Site[]>;
    },
    enabled: !!siteId,
  });

  const { data: apResponse, isLoading: isLoadingAP } = useQuery<APIResponse<AP[]>, Error>({
    queryKey: ["AP", site?.id, nodeMac],
    queryFn: async () => {
      console.log("🔍 Searching for AP:", { idSite: site?.id, mac: nodeMac });
      const response = await apService.find({ 
        idSite: site?.id, 
        mac: nodeMac 
      });
      console.log("📡 AP response:", response);
      return response as APIResponse<AP[]>;
    },
    enabled: !!site?.id && !!nodeMac
  });

  const { mutate: createView, isPending: isCreatingView } = useMutation<APIResponse<View>, Error, ViewCreate>({
    mutationFn: (view: ViewCreate) => viewService.create(view),
    onSuccess: (data) => {
      console.log("✅ View created successfully:", data.data);
      setView(data.data);
    },
    onError: (error) => {
      console.error("❌ Error creating view:", error);
      setIsError(true);
    },
  });

  // Effects
  useEffect(() => {
    if (siteResponse?.data?.[0]) {
      setSite(siteResponse.data[0]);
      console.log("✅ Site loaded:", siteResponse.data[0].id);
    }
  }, [siteResponse]);

  useEffect(() => {
    if (apResponse?.data?.[0]) {
      setAp(apResponse.data[0]);
      console.log("✅ AP loaded:", apResponse.data[0].id);
    } else if (apResponse && apResponse.data && apResponse.data.length === 0) {
      console.log("❌ AP not found for:", { siteId: site?.id, nodeMac });
    }
  }, [apResponse, site?.id, nodeMac]);

  useEffect(() => {
    const mac = clientMac;
    if (mac && ap?.id) {
      console.log("🔄 Creating view with:", { idAp: ap.id, mac: clientMac });
      createView({
        idAp: ap.id,
        mac: mac,
      });
    }
  }, [clientMac, ap?.id]);

  // Log final state
  useEffect(() => {
    console.log("📊 Final state:", {
      siteId,
      clientMac,
      nodeMac,
      site: site?.id,
      ap: ap?.id,
      view: view?.id,
      isLoading: isLoadingSite || isLoadingAP || isCreatingView,
      isError
    });
  }, [siteId, clientMac, nodeMac, site?.id, ap?.id, view?.id, isLoadingSite, isLoadingAP, isCreatingView, isError]);

  return {
    site,
    ap,
    view,
    isError,
    isLoading: isLoadingSite || isLoadingAP || isCreatingView,
  };
}; 