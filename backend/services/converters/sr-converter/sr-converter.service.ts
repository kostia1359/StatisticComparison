import { errors } from '../../../common/errors/errors';
import {
  AbstractConverter,
  EGameType,
  IConvertedData,
  IStatisticEntry,
  ITeamStatistic,
} from '../types';
import { ISourceData, ITeam } from './types';

import { sourceDataSchema } from './validation';

export const SERVICE_NAME = 'sr';

export class SrConverterService extends AbstractConverter<ISourceData> {
  constructor(data: ISourceData) {
    sourceDataSchema.validate(data);
    const { error, value } = sourceDataSchema.validate(data, {
      allowUnknown: false,
    });

    if (error) {
      throw errors.dataFormatDoesNotMatch(SERVICE_NAME);
    }

    super(value);
  }

  private createPlayersStatistic(team: ITeam): Record<string, IStatisticEntry> {
    const rushingPlayers = team.rushing.players.reduce(
      (players, player) => {
        return {
          ...players,
          [player.id]: {
            rushing: {
              attempts: player.attempts ?? null,
              touchdowns: player.touchdowns ?? null,
              yards: player.yards ?? null,
            },
            receiving: {
              receptions: null,
              yards: null,
            },
          },
        };
      },
      {} as Record<string, IStatisticEntry>,
    );

    return team.receiving.players.reduce((players, player) => {
      if (players[player.id]) {
        return {
          ...players,
          [player.id]: {
            ...players[player.id],
            receiving: {
              receptions: player.receptions,
              yards: player.yards,
            },
          },
        };
      }

      return {
        ...players,
        [player.id]: {
          rushing: {
            attempts: null,
            touchdowns: null,
            yards: null,
          },
          receiving: {
            receptions: player.receptions,
            yards: player.yards,
          },
        },
      };
    }, rushingPlayers);
  }

  private createTeamStatistic(team: ITeam): IStatisticEntry {
    return {
      rushing: {
        attempts: team.rushing.totals.attempts ?? null,
        touchdowns: team.rushing.totals.touchdowns ?? null,
        yards: team.rushing.totals.yards ?? null,
      },
      receiving: {
        receptions: team.receiving.totals.receptions,
        yards: team.receiving.totals.yards,
      },
    };
  }

  convertData(): IConvertedData {
    const homeTeam = this.data.statistics.home;
    const awayTeam = this.data.statistics.away;

    if (homeTeam.id === awayTeam.id) {
      throw errors.teamCanNotPlayWithItself(SERVICE_NAME);
    }

    const homePlayers = this.createPlayersStatistic(homeTeam);
    const awayPlayers = this.createPlayersStatistic(awayTeam);

    const teams: Record<string, ITeamStatistic> = {
      [homeTeam.id]: {
        players: Object.keys(homePlayers),
        type: EGameType.HOME,
        totals: this.createTeamStatistic(homeTeam),
      },
      [awayTeam.id]: {
        players: Object.keys(awayPlayers),
        type: EGameType.AWAY,
        totals: this.createTeamStatistic(awayTeam),
      },
    };

    const players = Object.entries(awayPlayers).reduce(
      (totalPlayers, [playerId, playerStatistyc]) => {
        if (totalPlayers[playerId]) {
          throw errors.duplicatePlayer(SERVICE_NAME);
        }

        return {
          ...totalPlayers,
          [playerId]: playerStatistyc,
        };
      },
      homePlayers,
    );

    const convertedData: IConvertedData = {
      teams,
      players,
      game: {
        id: this.data.game.id,
        attendance: this.data.game.attendance,
      },
    };

    return convertedData;
  }
}
