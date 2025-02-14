import { DataSourceOptions } from 'typeorm';

export const mssql: DataSourceOptions = {
    type: 'mssql',
    host: 'localhost',
    port: 1433, // Default port for MSSQL
    username: 'mssql1433',
    password: 'root',
    database: 'demo',
    entities: [__dirname + '/**/*.entity{.ts,.js}'], // Add your entities here
    synchronize: true, // Set to false in production
    options:{
        enableArithAbort: true,
        trustServerCertificate:true,
    },
};

export const mysqlConfig: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'demo',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export const postgresConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'demo',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};