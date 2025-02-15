import { DataSourceOptions } from 'typeorm';

// Set a default database type
export let config: DataSourceOptions;

export let dbType: 'mysql' | 'oracle' = 'mysql'; // Specify the allowed types

const type: string | undefined = process.env.DB_TYPE ?? dbType;

switch (type) {
  case 'oracle':
    config = {
      type: 'oracle',
      username: 'system',
      password: 'root',
      connectString: '192.168.1.96/xe',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    };
    break;
  case 'mysql':
    config = {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'demo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    };
    break;
  case 'mssql':
    config = {
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'mssql1433',
      password: 'root',
      database: 'demo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      options: {
        enableArithAbort: true,
        trustServerCertificate: true,
      },
    }; break;
  case 'pg':
    config = {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'demo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }; break;
}

