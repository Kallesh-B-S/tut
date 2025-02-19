import { Injectable } from '@nestjs/common';
import { config, MssqlConfig, MysqlConfig, OracleConfig } from 'ormconfig';
import { DataSource, DataSourceOptions } from 'typeorm';

@Injectable()
export class DbService {
    private dataSource: DataSource|null;

    constructor() {
        // Initialize dataSource to null
    }

    async initialize(options: DataSourceOptions
    ) {
        this.dataSource = new DataSource({
            ...options,
        });

        return this.dataSource.initialize().then(() => {
            console.log('Data Source has been initialized!');
        });
    }

    getDataSource(): DataSource {
        if (!this.dataSource) {
            throw new Error('Data source is not initialized. Call initialize() first.');
        }
        return this.dataSource;
    }

    getDbTypeConfig(type?: string): DataSourceOptions {
        if (type === 'oracle')
            return OracleConfig;
        if (type === 'mssql')
            return MssqlConfig;
        return MysqlConfig;
    }

    async closeConnection() {
        if (this.dataSource) {
            console.log("before conn close ---",this.dataSource.options);
            await this.dataSource.destroy();
            console.log('Data Source has been closed!');
            console.log("after conn close ---",this.dataSource.options);

            this.dataSource = null;
            return 'Connection Closed';
        } else {
            console.log('Data Source is not initialized.');
        }
    }
}
