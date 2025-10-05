export const configuration = () => ({
  database: {
    type: 'sqlite',
    database: ':memory:',
    url: 'postgresql://nest_user:nest_pass@localhost:5432/nest_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    dropSchema: true,
    synchronize: true,
    autoLoadEntities: true,
    logging: false,
  },
  jwt: {
    secret: 'THE_SECRET',
  },
  google: {
    clientId:
      '65738319816-84n4osqr38kdjhqdrr7q0a0id2d56gre.apps.googleusercontent.com',
  },
  web: {
    host: 'http://localhost:5173',
  },
  nestport: 3000,
});
