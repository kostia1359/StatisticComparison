import { ExternalConverterService, SERVICE_NAME } from './external-converter.service';
import { errors } from '../../../common/errors/errors';
import { ISourceData, IGamePlayer, ITeam } from './types';
import { faker } from '@faker-js/faker';
import correctData from './mocks/correctData.json';
import expectedResult from './mocks/expectedResult.json';

const generatePlayer = (): IGamePlayer => {
  return {
    id: faker.string.uuid(),
    rushAttempts: faker.number.int({ min: 0, max: 255 }),
    rushTds: faker.number.int({ min: 0, max: 255 }),
    rushYdsGained: faker.number.int({ min: 0, max: 255 }),
    rec: faker.number.int({ min: 0, max: 255 }),
    receivingYards: faker.number.int({ min: 0, max: 255 }),
  };
};

const generateTeam = (): ITeam => {
  return {
    id: faker.string.uuid(),
    players: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => generatePlayer()),
    rushAttempts: faker.number.int({ min: 0, max: 255 }),
    rushTds: faker.number.int({ min: 0, max: 255 }),
    rushYdsGained: faker.number.int({ min: 0, max: 255 }),
    rec: faker.number.int({ min: 0, max: 255 }),
    receivingYards: faker.number.int({ min: 0, max: 255 }),
  };
};

describe('ExternalConverterService', () => {
  it('should convert data to the desired format', () => {
    const converter = new ExternalConverterService(correctData);
    const convertedData = converter.convertData();

    expect(convertedData).toEqual(expectedResult);
  });

  it('should throw an error if data format does not match', () => {
    const invalidData = {
      sourceId: 'external',
      game: {},
    };

    expect(() => new ExternalConverterService(invalidData as ISourceData)).toThrow(
      errors.dataFormatDoesNotMatch(SERVICE_NAME),
    );
  });

  it('should throw an error if a team plays with itself', () => {
    const invalidData: ISourceData = {
      sourceId: 'external',
      game: {
        id: faker.string.uuid(),
        attendance: faker.number.int({ min: 0, max: 255 }),
        home: generateTeam(),
        away: generateTeam(),
      },
    };
    invalidData.game.home.id = invalidData.game.away.id;

    const converter = new ExternalConverterService(invalidData);
    expect(() => converter.convertData()).toThrow(errors.teamCanNotPlayWithItself(SERVICE_NAME));
  });

  it('should throw an error for duplicate players', () => {
    const duplicatePlayerData: ISourceData = {
      sourceId: 'external',
      game: {
        id: faker.string.uuid(),
        attendance: faker.number.int({ min: 0, max: 255 }),
        home: generateTeam(),
        away: generateTeam(),
      },
    };

    const duplicatePlayerId = faker.string.uuid();
    duplicatePlayerData.game.home.players.push({ ...generatePlayer(), id: duplicatePlayerId });
    duplicatePlayerData.game.away.players.push({ ...generatePlayer(), id: duplicatePlayerId });

    const converter = new ExternalConverterService(duplicatePlayerData);
    expect(() => converter.convertData()).toThrow(errors.duplicatePlayer(SERVICE_NAME));
  });
});
