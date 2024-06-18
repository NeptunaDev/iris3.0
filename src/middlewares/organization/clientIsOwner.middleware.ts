import OrganizationModel from "@/models/Organization.model";
import { JwtPayload } from "jsonwebtoken";

export const isOwner = async (jwt: JwtPayload, id: string) => {
  try {
    const project = await OrganizationModel.findById(id);
    const { id: idClient } = jwt;

    if (!project) return new Error("Project not found");
    if (project.idClient.toString() !== idClient) return new Error("Client is not the owner of the project");
    
    return true;
  } catch (error) {
    if (error instanceof Error) {
      return new Error(error.message);
    }
  }
};
