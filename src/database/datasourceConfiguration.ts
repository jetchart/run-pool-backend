import { configuration as devConfiguration } from './../config/config.development';
import { configuration as productionConfiguration } from './../config/config.production';
import { configuration as stagingConfiguration } from './../config/config.staging';
import { configuration as testingConfiguration } from './../config/config.testing';
import * as process from 'node:process';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const getDataSourceOptions =
  async (): Promise<PostgresConnectionOptions> => {
    let conf: Record<string, unknown> = devConfiguration();
    if (process.env.NODE_ENV == 'testing' || process.env.NODE_ENV == 'test')
      conf = testingConfiguration();
    if (process.env.NODE_ENV == 'staging') conf = stagingConfiguration();
    if (process.env.NODE_ENV == 'production') conf = productionConfiguration();
    const database = async (): Promise<Record<string, unknown>> => {
      return conf;
    };
    const databaseConfig: Record<string, unknown> = await database();
    return databaseConfig.database as PostgresConnectionOptions;
  };
