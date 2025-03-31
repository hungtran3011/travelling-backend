import { Test, TestingModule } from '@nestjs/testing';
import { SightseeingController } from './sightseeing.controller';

describe('SightseeingController', () => {
  let controller: SightseeingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SightseeingController],
    }).compile();

    controller = module.get<SightseeingController>(SightseeingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
