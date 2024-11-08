import { AP, FormField, Site, View, ViewInfo } from "./interfaces";

export const fetchSite = async (siteId: string): Promise<Site> => {
  const endpoint = `https://api-iris-0yax.onrender.com/api/v1/ubiquiti/site?siteId=${siteId}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.data;
};

export const fetchAP = async (siteId: string, apMac: string): Promise<AP> => {
  const endpoint = `https://api-iris-0yax.onrender.com/api/v1/ubiquiti/ap?idSite=${siteId}&mac=${apMac}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.data;
};

export const createView = async (apId: string, mac: string): Promise<View> => {
  const response = await fetch(`/api/view`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idAp: apId,
      mac: mac,
    }),
  });
  console.log(response)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.data;
};

export const connectUser = async (params: {
  id: string;
  ap: string;
  site: string;
  idSite: string;
}): Promise<void> => {
  const response = await fetch(
    `https://api-iris-0yax.onrender.com/api/v1/ubiquiti/connecting`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }
  );
  console.log(response)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const updateView = async (viewId: string, formData: FormField[]): Promise<void> => {
    const viewInfo: ViewInfo[] = formData.map(({ label, value, type }) => ({
      label,
      value,
      type
    }));
  
    const body = {
      id: viewId,
      isLogin: true,
      info: viewInfo,
    };
  
    const response = await fetch(`/api/view`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };