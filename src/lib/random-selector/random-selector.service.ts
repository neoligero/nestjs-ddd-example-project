import { Injectable } from '@nestjs/common';

export interface RandomSelectorOption {
  id: number;
  weight: number;
}

export interface RandomSelectorOptionNormalized {
  id: number;
  weight: number;
  normalizedWeight?: number;
}

@Injectable()
export class RandomSelectorService {
  invoke(params: RandomSelectorOption[]): RandomSelectorOptionNormalized {
    const totalWeight = params.reduce((acc, item) => {
      acc += item.weight;
      return acc;
    }, 0);
    const normalizedWeight = params.map(i => {
      return {
        ...i,
        weight: i.weight / totalWeight
      }
    });
    const sortedRarity = normalizedWeight.sort((min, max) => max.weight - min.weight);

    const selections: RandomSelectorOptionNormalized[] = [];
    sortedRarity.forEach((rarity, index) => {
      const prev: RandomSelectorOptionNormalized = selections[index - 1];
      if (!prev) {
        selections.push({
          ...rarity,
          normalizedWeight: 0 + rarity.weight
        });
        return;
      }
      selections.push({
        ...rarity,
        normalizedWeight: prev.normalizedWeight + rarity.weight
      });
    });

    const random = Math.random();
    for (const select of selections) {
      if (select.normalizedWeight >= random) {
        return select;
      }
    }
    return;
  }
}