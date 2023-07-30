import Joi from 'joi';
import {
  IReceivingTotals,
  IRushingTotals,
  IRushingGamePlayer,
  IReceivingGamePlayer,
  ITeam,
  IGame,
  ISourceData,
} from './types';

const rushingTotalsSchema = Joi.object<IRushingTotals>({
  attempts: Joi.number().required(),
  touchdowns: Joi.number().required(),
  yards: Joi.number().required(),
});

const receivingTotalsSchema = Joi.object<IReceivingTotals>({
  receptions: Joi.number().required(),
  yards: Joi.number().required(),
});

const rushingGamePlayerSchena = Joi.object<IRushingGamePlayer>({
  id: Joi.string().required(),
  attempts: Joi.number().required(),
  touchdowns: Joi.number().required(),
  yards: Joi.number().required(),
});

const receivingGamePlayerSchema = Joi.object<IReceivingGamePlayer>({
  id: Joi.string().required(),
  receptions: Joi.number().required(),
  yards: Joi.number().required(),
});

const teamSchema = Joi.object<ITeam>({
  id: Joi.string().required(),
  rushing: Joi.object({
    totals: rushingTotalsSchema.required(),
    players: Joi.array().items(rushingGamePlayerSchena).unique('id').required(),
  }).required(),
  receiving: Joi.object({
    totals: receivingTotalsSchema.required(),
    players: Joi.array().items(receivingGamePlayerSchema).unique('id').required(),
  }).required(),
});

const gameSchema = Joi.object<IGame>({
  id: Joi.string().required(),
  attendance: Joi.number().required(),
});

export const sourceDataSchema = Joi.object<ISourceData>({
  sourceId: Joi.string().required(),
  game: gameSchema.required(),
  statistics: Joi.object({
    home: teamSchema.required(),
    away: teamSchema.required(),
  }).required(),
});
