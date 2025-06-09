import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingestion } from './entities/ingestion.entity';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingestion]),
    ClientsModule.register([
      {
        name: 'INGESTION_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
    ]),
  ],
  providers: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}
