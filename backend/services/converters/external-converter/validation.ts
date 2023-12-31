import Joi from 'joi';
import type { ISourceData, IGamePlayer, ITeam, IGame } from './types';

const gamePlayerSchema = Joi.object<IGamePlayer>({
  id: Joi.string().required(),
  rushAttempts: Joi.number(),
  rushTds: Joi.number(),
  rushYdsGained: Joi.number(),
  rec: Joi.number(),
  receivingYards: Joi.number(),
});

const teamSchema = Joi.object<ITeam>({
  id: Joi.string().required(),
  players: Joi.array().items(gamePlayerSchema).unique('id'),
  rushAttempts: Joi.number().required(),
  rushTds: Joi.number().required(),
  rushYdsGained: Joi.number().required(),
  rec: Joi.number().required(),
  receivingYards: Joi.number().required(),
});

const gameSchema = Joi.object<IGame>({
  id: Joi.string().required(),
  attendance: Joi.number().required(),
  home: teamSchema.required(),
  away: teamSchema.required(),
});

export const sourceDataSchema = Joi.object<ISourceData>({
  sourceId: Joi.string().required(),
  game: gameSchema.required(),
});
