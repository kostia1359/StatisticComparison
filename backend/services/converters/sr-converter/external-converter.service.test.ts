import { errors } from '../../../common/errors/errors';
import { SrConverterService, SERVICE_NAME } from './sr-converter.service';
import type { ISourceData, ITeam } from './types';
import { faker } from '@faker-js/faker';
import correctData from './mocks/correctData.json';
import expectedResult from './mocks/expectedResult.json';

const generatePlayer = () => {
  const id = faker.string.uuid();

  return {
    id,
    rushing: {
      attempts: faker.number.int({ min: 0, max: 255 }),
      touchdowns: faker.number.int({ min: 0, max: 255 }),
      yards: faker.number.int({ min: 0, max: 255 }),
    },
    receiving: {
      receptions: faker.number.int({ min: 0, max: 255 }),
      yards: faker.number.int({ min: 0, max: 255 }),
    },
  };
};

const generateTeam = (): ITeam => {
  const players = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
    generatePlayer(),
  );

  return {
    id: faker.string.uuid(),
    rushing: {
      totals: {
        attempts: faker.number.int({ min: 0, max: 255 }),
        touchdowns: faker.number.int({ min: 0, max: 255 }),
        yards: faker.number.int({ min: 0, max: 255 }),
      },
      players: players.map((player) => ({ id: player.id, ...player.rushing })),
    },
    receiving: {
      totals: {
        receptions: faker.number.int({ min: 0, max: 255 }),
        yards: faker.number.int({ min: 0, max: 255 }),
      },
      players: players.map((player) => ({ id: player.id, ...player.receiving })),
    },
  };
};

const createFakeSourceData = (): ISourceData => ({
  sourceId: faker.string.uuid(),
  game: {
    id: faker.string.uuid(),
    attendance: faker.number.int({ min: 0, max: 255 }),
  },
  statistics: {
    home: generateTeam(),
    away: generateTeam(),
  },
});

describe('SrConverterService', () => {
  it('should convert data to the desired format', () => {
    const converter = new SrConverterService(correctData);
    const convertedData = converter.convertData();

    expect(convertedData).toEqual(expectedResult);
  });

  it('should throw an error if data format does not match', () => {
    const invalidSourceData = {
      sourceId: faker.string.uuid(),
      game: {
        id: faker.string.uuid(),
        attendance: faker.number.int({ min: 0, max: 255 }),
      },
    };

    expect(() => new SrConverterService(invalidSourceData as ISourceData)).toThrow(
      errors.dataFormatDoesNotMatch(SERVICE_NAME),
    );
  });

  it('should throw an error if a team plays with itself', () => {
    const sourceData = createFakeSourceData();
    sourceData.statistics.home.id = sourceData.statistics.away.id;

    const converter = new SrConverterService(sourceData);

    expect(() => converter.convertData()).toThrow(errors.teamCanNotPlayWithItself(SERVICE_NAME));
  });

  it('should throw an error for duplicate players', () => {
    const sourceData = createFakeSourceData();
    sourceData.statistics.home.rushing.players[0].id =
      sourceData.statistics.away.rushing.players[0].id;

    const converter = new SrConverterService(sourceData);
    expect(() => converter.convertData()).toThrow(errors.duplicatePlayer(SERVICE_NAME));
  });
});
