import { DataSource } from 'typeorm';
import { getDataSourceOptions } from './datasourceConfiguration';

export const AppDataSource = (async () => {
  const options = await getDataSourceOptions();
  return new DataSource(options);
})();
