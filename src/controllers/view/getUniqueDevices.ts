// Import dependences
// External
import { NextResponse } from "next/server";

// Personal
import ViewModel from "@/models/View.model";
import { JwtPayload } from "jsonwebtoken";
import OrganizationModel from "@/models/Organization.model";
import SiteModel from "@/models/Site.models";
import APModel from "@/models/AP.model";

const getUniqueDevices = async (filters: any, jwt: JwtPayload) => {
  try {
    const {startDate: startDateStr, endDate: endDateStr, ...restQueries} = filters
    const startDate = startDateStr ? new Date(startDateStr.replaceAll('%2F', '/')) : null
    const endDate = endDateStr ? new Date(endDateStr.replaceAll('%2F', '/')) : null

    // Get data
    const { id: idClient } = jwt;
    const organizations = await OrganizationModel.find({ idClient });
    const organizationsId = organizations.map(
      (organization) => organization._id
    );
    const sites = await SiteModel.find({
      idOrganization: { $in: organizationsId },
    });
    const aps = await APModel.find({
      idSite: { $in: sites.map((site) => site._id) },
    });

    const queries = {
      ...restQueries,
      idAp: { $in: aps.map((ap) => ap._id) }
    }

    if (startDate || endDate) {
      queries.createdAt = {}
      if (startDate) queries.createdAt.$gte = new Date(startDate)
      if (endDate) queries.createdAt.$lte = new Date(endDate)
    }

    const views = await ViewModel.distinct("mac", queries);

    // Return response
    return NextResponse.json(
      {
        message: "Controller get successfully",
        status: 200,
        data: views.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return new Error(error.message);
  }
};

// Export module
export { getUniqueDevices };
