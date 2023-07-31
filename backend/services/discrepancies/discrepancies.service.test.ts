import { TestConverterService } from '../converters/test-converter/test-converter.service';
import { EGameType, IConvertedData, IStatisticEntry, ITeamStatistic } from '../converters/types';
import { DiscrepancyService } from './discrepancies.service';
import { IDiscrepancy } from './types';

const createDiscrepancy = <T>(baseValue: T | null, externalValue: T | null): IDiscrepancy<T> => {
  return {
    baseValue,
    externalValue,
  };
};

const generateStatisticEntry = (randomStat: number): IStatisticEntry => ({
  rushing: {
    attempts: randomStat,
    touchdowns: randomStat,
    yards: randomStat,
  },
  receiving: {
    receptions: randomStat,
    yards: randomStat,
  },
});

describe('DiscrepancyService', () => {
  const discrepancyService = new DiscrepancyService();

  it('should find 0 discrepancies with the same data', () => {
    const baseGame: IConvertedData = {
      game: {
        id: 'id',
        attendance: 100,
      },
      players: {
        ['p1']: generateStatisticEntry(10),
        ['p2']: generateStatisticEntry(20),
      },
      teams: {
        ['home_t1']: {
          players: ['p1'],
          totals: generateStatisticEntry(10),
          type: EGameType.HOME,
        },
        ['away_t1']: {
          players: ['p2'],
          totals: generateStatisticEntry(10),
          type: EGameType.AWAY,
        },
      },
    };

    const externalGame = {
      ...baseGame,
    };

    const baseConverter = new TestConverterService(baseGame);
    const externalConverter = new TestConverterService(externalGame);

    const discrepancies = discrepancyService.createDiscrepancies(baseConverter, externalConverter);

    expect(discrepancies).toEqual(baseConverter.convertData());
  });

  it('should find discrepancy in game', () => {
    const baseGame: IConvertedData = {
      game: {
        id: 'id',
        attendance: 100,
      },
      players: {
        ['p1']: generateStatisticEntry(10),
        ['p2']: generateStatisticEntry(20),
      },
      teams: {
        ['home_t1']: {
          players: ['p1'],
          totals: generateStatisticEntry(10),
          type: EGameType.HOME,
        },
        ['away_t1']: {
          players: ['p2'],
          totals: generateStatisticEntry(10),
          type: EGameType.AWAY,
        },
      },
    };

    const externalGame = {
      ...baseGame,
      game: {
        id: 'id',
        attendance: 105,
      },
    };

    const baseConverter = new TestConverterService(baseGame);
    const externalConverter = new TestConverterService(externalGame);

    const discrepancies = discrepancyService.createDiscrepancies(baseConverter, externalConverter);

    const baseStatistic = baseConverter.convertData();
    const externalStatistic = externalConverter.convertData();

    expect(discrepancies.game).toEqual({
      baseValue: baseStatistic.game,
      externalValue: externalStatistic.game,
    });

    expect(discrepancies.players).toEqual(baseStatistic.players);
    expect(discrepancies.teams).toEqual(baseStatistic.teams);
  });

  it('should find discrepancy for a single player', () => {
    const baseGame: IConvertedData = {
      game: {
        id: 'id',
        attendance: 100,
      },
      players: {
        ['p1']: generateStatisticEntry(10),
        ['p2']: generateStatisticEntry(20),
      },
      teams: {
        ['home_t1']: {
          players: ['p1'],
          totals: generateStatisticEntry(10),
          type: EGameType.HOME,
        },
        ['away_t1']: {
          players: ['p1'],
          totals: generateStatisticEntry(10),
          type: EGameType.AWAY,
        },
      },
    };

    const externalGame = {
      ...baseGame,
      players: {
        ['p1']: generateStatisticEntry(10),
        ['p2']: generateStatisticEntry(200),
      },
    };

    const baseConverter = new TestConverterService(baseGame);
    const externalConverter = new TestConverterService(externalGame);

    const discrepancies = discrepancyService.createDiscrepancies(baseConverter, externalConverter);

    const baseStatistic = baseConverter.convertData();
    const externalStatistic = externalConverter.convertData();

    expect(discrepancies.game).toEqual(baseStatistic.game);

    expect(discrepancies.players['p1']).toEqual(baseStatistic.players['p1']);
    expect(discrepancies.players['p2']).toEqual({
      baseValue: baseStatistic.players['p2'],
      externalValue: externalStatistic.players['p2'],
    });

    expect(discrepancies.teams).toEqual(baseStatistic.teams);
  });

  it('should find discrepancy when players are missed', () => {
    const baseGame: IConvertedData = {
      game: {
        id: 'id',
        attendance: 100,
      },
      players: {
        ['p1']: generateStatisticEntry(10),
        ['p2']: generateStatisticEntry(20),
        ['p3']: generateStatisticEntry(25),
      },
      teams: {
        ['home_t1']: {
          players: ['p1', 'p3'],
          totals: generateStatisticEntry(10),
          type: EGameType.HOME,
        },
        ['away_t1']: {
          players: ['p2'],
          totals: generateStatisticEntry(10),
          type: EGameType.AWAY,
        },
      },
    };

    const externalGame = {
      ...baseGame,
      players: {
        ['p1']: generateStatisticEntry(10),
        ['p2']: generateStatisticEntry(20),
        ['p4']: generateStatisticEntry(25),
      },
      teams: {
        ['home_t1']: {
          players: ['p1', 'p4'],
          totals: generateStatisticEntry(10),
          type: EGameType.HOME,
        },
        ['away_t1']: {
          players: ['p2'],
          totals: generateStatisticEntry(10),
          type: EGameType.AWAY,
        },
      },
    };

    const baseConverter = new TestConverterService(baseGame);
    const externalConverter = new TestConverterService(externalGame);

    const discrepancies = discrepancyService.createDiscrepancies(baseConverter, externalConverter);

    const baseStatistic = baseConverter.convertData();
    const externalStatistic = externalConverter.convertData();

    expect(discrepancies.game).toEqual(baseStatistic.game);

    expect(discrepancies.players['p1']).toEqual(baseStatistic.players['p1']);
    expect(discrepancies.players['p2']).toEqual(baseStatistic.players['p2']);

    expect(discrepancies.players['p3']).toEqual({
      baseValue: baseStatistic.players['p3'],
      externalValue: null,
    });
    expect(discrepancies.players['p4']).toEqual({
      baseValue: null,
      externalValue: externalStatistic.players['p4'],
    });

    expect((discrepancies.teams['away_t1'] as ITeamStatistic).totals).toEqual(
      baseStatistic.teams['away_t1'].totals,
    );

    expect(discrepancies.teams['home_t1']).toEqual({
      baseValue: baseStatistic.teams['home_t1'],
      externalValue: externalStatistic.teams['home_t1'],
    });
  });

  it('should find discrepancy for team statistic', () => {
    const baseGame: IConvertedData = {
      game: {
        id: 'id',
        attendance: 100,
      },
      players: {
        ['p1']: generateStatisticEntry(10),
        ['p2']: generateStatisticEntry(20),
        ['p3']: generateStatisticEntry(25),
      },
      teams: {
        ['home_t1']: {
          players: ['p1', 'p3'],
          totals: generateStatisticEntry(10),
          type: EGameType.HOME,
        },
        ['away_t1']: {
          players: ['p2'],
          totals: generateStatisticEntry(10),
          type: EGameType.AWAY,
        },
      },
    };

    const externalGame = {
      ...baseGame,
      teams: {
        ...baseGame.teams,
        ['home_t1']: {
          ...baseGame.teams['home_t1'],
          totals: generateStatisticEntry(30),
        },
      },
    };

    const baseConverter = new TestConverterService(baseGame);
    const externalConverter = new TestConverterService(externalGame);

    const discrepancies = discrepancyService.createDiscrepancies(baseConverter, externalConverter);

    const baseStatistic = baseConverter.convertData();
    const externalStatistic = externalConverter.convertData();

    expect(discrepancies.game).toEqual(baseStatistic.game);
    expect(discrepancies.players).toEqual(baseStatistic.players);

    expect(discrepancies.teams['away_t1']).toEqual(baseStatistic.teams['away_t1']);
    expect(discrepancies.teams['home_t1']).toEqual(
      createDiscrepancy(baseStatistic.teams['home_t1'], externalStatistic.teams['home_t1']),
    );
  });
});
