import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('ingestion')
export class IngestionController {
  constructor(private ingestionService: IngestionService) {}

  @UseGuards(AuthGuard)
  @Post('trigger')
  async trigger() {
    return this.ingestionService.triggerIngestion();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getStatus(@Param('id') id: string) {
    return this.ingestionService.getIngestionStatus(+id);
  }
}
