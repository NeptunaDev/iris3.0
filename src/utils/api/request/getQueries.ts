import { NextRequest } from "next/server";

export const getQueries = (req: NextRequest): { [key: string]: string } => {
  // Get data
  const searchParams = req.nextUrl.searchParams;
  const queriesStr = searchParams.toString();
  const queries: { [key: string]: string } = {};
  queriesStr.split("&").forEach((query) => {
    const [key, value] = query.split("=");
    if (value) {
      queries[key] = value;
    }
  });
  return queries;
};
