import { Test, TestingModule } from '@nestjs/testing';
import { SightseeingService } from './sightseeing.service';

describe('SightseeingService', () => {
  let service: SightseeingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SightseeingService],
    }).compile();

    service = module.get<SightseeingService>(SightseeingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
