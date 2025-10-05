import { DataSource } from 'typeorm';
import { getDataSourceOptions } from './datasourceConfiguration';

const buildDataSource = async (): Promise<DataSource> => {
  const options = await getDataSourceOptions();
  return new DataSource(options);
};

export default buildDataSource;
