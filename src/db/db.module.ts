import { Module, OnModuleInit } from '@nestjs/common';
import { MssqlDataSourceModule } from './mssql-data-source/mssql-data-source.module';
import { OracleDataSourceModule } from './oracle-data-source/oracle-data-source.module';
import { DbController } from './db.controller';
import { DbService } from './db.service';
import { config } from 'ormconfig';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [MssqlDataSourceModule, OracleDataSourceModule],
  controllers: [DbController],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
