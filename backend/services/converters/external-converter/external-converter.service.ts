import { errors } from '../../../common/errors/errors';
import {
  AbstractConverter,
  EGameType,
  IConvertedData,
  IStatisticEntry,
  ITeamStatistic,
} from '../types';
import { IExternalSourceData, IGamePlayer, ITeam } from './types';

import { externalSourceDataSchema } from './validation';

export class ExternalConverterService extends AbstractConverter<IExternalSourceData> {
  constructor(data: IExternalSourceData) {
    externalSourceDataSchema.validate(data);
    const { error, value } = externalSourceDataSchema.validate(data, {
      allowUnknown: false,
    });

    if (error) {
      throw errors.dataFormatDoesNotMatch('external');
    }

    super(value);
  }

  private createPlayerStatistic(player: IGamePlayer): IStatisticEntry {
    return {
      rushing: {
        attempts: player.rushAttempts ?? null,
        touchdowns: player.rushTds ?? null,
        yards: player.rushYdsGained ?? null,
      },
      receiving: {
        receptions: player.rec ?? null,
        yards: player.receivingYards ?? null,
      },
    };
  }

  private createTeamStatistic(team: ITeam): IStatisticEntry {
    return {
      rushing: {
        attempts: team.rushAttempts ?? null,
        touchdowns: team.rushTds ?? null,
        yards: team.rushYdsGained ?? null,
      },
      receiving: {
        receptions: team.rec,
        yards: team.receivingYards,
      },
    };
  }

  convertData(): IConvertedData {
    if (this.data.game.home.id === this.data.game.away.id) {
      throw errors.teamCanNotPlayWithItself('external');
    }
    const teams: Record<string, ITeamStatistic> = {
      [this.data.game.home.id]: {
        players: [],
        type: EGameType.HOME,
        totals: this.createTeamStatistic(this.data.game.home),
      },
      [this.data.game.away.id]: {
        players: [],
        type: EGameType.AWAY,
        totals: this.createTeamStatistic(this.data.game.away),
      },
    };
    const players: Record<string, IStatisticEntry> = {};

    this.data.game.home.players.forEach((player) => {
      const playerId = player.id;
      if (players[playerId]) {
        throw errors.duplicatePlayer('external');
      }

      players[playerId] = this.createPlayerStatistic(player);
      teams[this.data.game.home.id].players.push(playerId);
    });

    this.data.game.away.players.forEach((player) => {
      const playerId = player.id;
      if (players[playerId]) {
        throw errors.duplicatePlayer('external');
      }

      players[playerId] = this.createPlayerStatistic(player);
      teams[this.data.game.away.id].players.push(playerId);
    });

    const convertedData: IConvertedData = {
      players,
      teams,
      game: {
        id: this.data.game.id,
        attendance: this.data.game.attendance.toString(),
      },
    };

    return convertedData;
  }
}
