import { ExternalConverterService } from '../converters/external-converter/external-converter.service';
import { ISourceData as IExternalSourceData } from '../converters/external-converter/types';
import { SrConverterService } from '../converters/sr-converter/sr-converter.service';
import { ISourceData as IBaseData } from '../converters/sr-converter/types';

import * as fs from 'fs';

class DataService {
  public externalData: IExternalSourceData;
  public baseData: IBaseData;

  constructor() {
    const externalFileData = JSON.parse(fs.readFileSync('data/external.json', 'utf-8'));
    this.externalData = new ExternalConverterService(externalFileData).data;

    const baseFileData = JSON.parse(fs.readFileSync('data/sr.json', 'utf-8'));
    this.baseData = new SrConverterService(baseFileData).data;
  }

  setData(externalData: any, baseData: any) {
    this.externalData = new ExternalConverterService(externalData).data;
    this.baseData = new SrConverterService(baseData).data;
  }
}

export const dataService = new DataService();
