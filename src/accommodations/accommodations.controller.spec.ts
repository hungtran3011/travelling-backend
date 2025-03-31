import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationsController } from './accommodations.controller';

describe('AccommodationsController', () => {
  let controller: AccommodationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccommodationsController],
    }).compile();

    controller = module.get<AccommodationsController>(AccommodationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
