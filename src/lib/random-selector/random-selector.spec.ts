import { Test, TestingModule } from '@nestjs/testing';
import { RandomSelectorOption, RandomSelectorService } from './random-selector.service';

describe('RandomSelectorService', () => {
  let service: RandomSelectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomSelectorService],
    }).compile();

    service = module.get<RandomSelectorService>(RandomSelectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the higher option', () => {
    const options: RandomSelectorOption[] = [
      {
        id: 1,
        weight: 1
      },
      {
        id: 2,
        weight: 0
      }
    ]
    const result = service.invoke(options);
    expect(result.id).toBe(1);
  })

  it('should return the higher option', () => {
    const options: RandomSelectorOption[] = [
      {
        id: 1,
        weight: 0
      },
      {
        id: 2,
        weight: 0
      }
    ]
    const result = service.invoke(options);
    expect(result).toBe(undefined);
  })
});
