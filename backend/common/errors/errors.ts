import { APIError } from './ApiError';

export const errors = {
  dataFormatDoesNotMatch: (source: string) =>
    new APIError(`Data format does not match for ${source} source`, 500),
  teamCanNotPlayWithItself: (source: string) =>
    new APIError(`Team can not play with itself for ${source}`, 500),
  duplicatePlayer: (source: string) => new APIError(`Player is duplicated for ${source}`, 500),
  errorCreatingDiscrepancies: () => new APIError(`Error during creating discrepancies`, 500),
  discrepancyNotFound: () => new APIError('Discrepancy not found', 404),
};
