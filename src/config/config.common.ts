import type { DataSourceOptions } from 'typeorm';

export const DEFAULT_DATA_SOURCE_OPTIONS: Partial<DataSourceOptions> = {
  type: 'postgres',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false,
};
