export interface QueriesGetUbiquiti {
  type?: "SITE" | "AP";
  siteId?: string;
  mac?: string;
}

export const getQueries = (req: Request) => {
  const urlQueries = req.url.split("?")[1];
  const queriesStr = urlQueries.split("&");
  const queries: QueriesGetUbiquiti = {};
  queriesStr.forEach((query) => {
    const [key, value] = query.split("=");
    if (key === "type") {
      if (value === "SITE" || value === "AP") queries.type = value;
    }
    if (key === "siteId") queries.siteId = value;
    if (key === "mac") queries.mac = value;
  });
  return queries;
};
