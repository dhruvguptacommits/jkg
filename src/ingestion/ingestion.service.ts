import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ingestion } from "./entities/ingestion.entity";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Ingestion)
    private ingestionRepository: Repository<Ingestion>,
    @Inject("INGESTION_SERVICE") private client: ClientProxy
  ) {}

  async triggerIngestion(): Promise<Ingestion> {
    const ingestion = this.ingestionRepository.create({
      status: "pending",
      startedAt: new Date(),
    });
    await this.ingestionRepository.save(ingestion);
    this.client.emit("start_ingestion", ingestion.id);
    return ingestion;
  }

  async getIngestionStatus(id: number): Promise<Ingestion> {
    const ingestion = await this.ingestionRepository.findOne({ where: { id } });
    if (!ingestion) {
      throw new NotFoundException(`Ingestion with ID ${id} not found`);
    }
    return ingestion;
  }

  async updateIngestionStatus(id: number, status: string) {
    const ingestion = await this.ingestionRepository.findOne({ where: { id } });
    if (!ingestion) {
      throw new NotFoundException(`Ingestion with ID ${id} not found`);
    }
    ingestion.status = status;
    if (status === "completed" || status === "failed") {
      ingestion.completedAt = new Date();
    }
    return this.ingestionRepository.save(ingestion);
  }
}
