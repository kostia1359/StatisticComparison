import { AbstractConverter, IConvertedData } from '../types';

export class TestConverterService extends AbstractConverter<IConvertedData> {
  constructor(data: IConvertedData) {
    super(data);
  }

  convertData(): IConvertedData {
    return this.data;
  }
}
