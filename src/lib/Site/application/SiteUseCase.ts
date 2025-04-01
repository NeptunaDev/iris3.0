import { Repository } from "@/lib/Shared/domain/repository";
import { Site, SiteCreate, SiteUpdate } from "../domain/Site";

export class SiteUseCase {
  constructor(private readonly siteRepository: Repository<Site>) {}

  async findAll(): Promise<Site[]> {
    try {
      return await this.siteRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async create(site: SiteCreate): Promise<Site> {
    try {
      return await this.siteRepository.create(site);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, site: SiteUpdate): Promise<Site> {
    try {
      return await this.siteRepository.update(id, site);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.siteRepository.remove(id);
    } catch (error) {
      throw error;
    }
  }
} 