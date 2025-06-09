import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from '../../src/ingestion/ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingestion } from '../../src/ingestion/entities/ingestion.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

describe('IngestionService', () => {
  let service: IngestionService;
  let repository: Repository<Ingestion>;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Ingestion),
          useClass: Repository,
        },
        {
          provide: 'INGESTION_SERVICE',
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    repository = module.get<Repository<Ingestion>>(getRepositoryToken(Ingestion));
    client = module.get<ClientProxy>('INGESTION_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should trigger ingestion', async () => {
    const ingestion = { id: 1, status: 'pending', startedAt: new Date() };
    jest.spyOn(repository, 'create').mockReturnValue(ingestion as any);
    jest.spyOn(repository, 'save').mockResolvedValue(ingestion as any);
    jest.spyOn(client, 'emit');
    const result = await service.triggerIngestion();
    expect(result).toEqual(ingestion);
    expect(client.emit).toHaveBeenCalledWith('start_ingestion', 1);
  });
});
