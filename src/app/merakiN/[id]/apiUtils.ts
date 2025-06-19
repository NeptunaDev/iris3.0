import { AP, FormField, Site, View as LocalView, ViewInfo } from "./interfaces";
import { createSiteFetchRepository } from "@/lib/Site/infrastructure/SiteFetchRepository";
import { createSiteService } from "@/lib/Site/application/SiteUseCase";
import { createAPFetchRepository } from "@/lib/AP/infrastructure/APFetchRepository";
import { createAPService } from "@/lib/AP/application/APUseCase";
import { createViewFetchRepository } from "@/lib/View/infrastructure/ViewFetchRepository";
import { createViewService } from "@/lib/View/application/ViewService";
import { ViewIndividualInfo, FormFieldType } from "@/lib/View/domain/View";
import { SiteType } from "@/models/Site.models";

// Initialize services
const siteRepository = createSiteFetchRepository();
const siteService = createSiteService(siteRepository);
const apRepository = createAPFetchRepository();
const apService = createAPService(apRepository);
const viewRepository = createViewFetchRepository();
const viewService = createViewService(viewRepository);

export const fetchSite = async (siteId: string): Promise<Site> => {
  try {
    console.log('Fetching site with ID:', siteId);
    const response = await siteService.find({ siteId });
    if (!Array.isArray(response.data) || response.data.length === 0) {
      throw new Error('Site not found');
    }
    const site = response.data[0];
    return {
      _id: site.id || '',
      idOrganization: site.idOrganization || '',
      type: (site.type as SiteType) || SiteType.MERAKI,
      siteId: site.siteId || '',
      name: site.name || '',
      createdAt: site.createdAt || new Date().toISOString(),
      updatedAt: site.updatedAt || new Date().toISOString()
    };
  } catch (error) {
    console.error('Fetch Site Error:', error);
    throw error;
  }
};

export const fetchAP = async (siteId: string, apMac: string): Promise<AP> => {
  try {
    console.log('Fetching AP with siteId:', siteId, 'and MAC:', apMac);
    const response = await apService.find({ 
      idSite: siteId, 
      mac: apMac 
    });
    if (!Array.isArray(response.data) || response.data.length === 0) {
      throw new Error('AP not found');
    }
    const ap = response.data[0];
    return {
      _id: ap.id || '',
      idSite: ap.idSite || '',
      mac: ap.mac || '',
      name: ap.name || '',
      createdAt: ap.createdAt || new Date().toISOString(),
      updatedAt: ap.updatedAt || new Date().toISOString()
    };
  } catch (error) {
    console.error('Fetch AP Error:', error);
    throw error;
  }
};

export const createView = async (apId: string, mac: string): Promise<LocalView> => {
  try {
    console.log('Creating view for AP:', apId, 'and MAC:', mac);
    const response = await viewService.create({
      idAp: apId,
      mac: mac,
    });
    const view = response.data;
    return {
      _id: view.id || '',
      idAp: view.idAp || '',
      mac: view.mac || '',
      isLogin: view.isLogin || false,
      info: view.info?.map(info => ({
        label: info.label || '',
        value: info.value || '',
        type: info.type || ''
      })) || [],
      createdAt: view.createdAt || new Date().toISOString(),
      updatedAt: view.updatedAt || new Date().toISOString()
    };
  } catch (error) {
    console.error('Create View Error:', error);
    throw error;
  }
};

export const connectUser = async (params: {
  id: string;
  ap: string;
  site: string;
  idSite: string;
}): Promise<void> => {
  try {
    console.log('Connecting user with params:', params);
    const response = await fetch(
      `https://api-iris-0yax.onrender.com/api/v1/meraki/connecting`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to connect user');
    }
  } catch (error) {
    console.error('Connect User Error:', error);
    throw error;
  }
};

export const updateView = async (viewId: string, formData: FormField[]): Promise<void> => {
  try {
    console.log('Updating view:', viewId, 'with data:', formData);
    const viewInfo: ViewIndividualInfo[] = formData.map(({ label, value, type }) => ({
      label,
      value,
      type: type as FormFieldType
    }));
  
    await viewService.update(viewId, {
      isLogin: true,
      info: viewInfo,
    });
  } catch (error) {
    console.error('Update View Error:', error);
    throw error;
  }
}; 