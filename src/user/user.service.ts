import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { config, dbType } from 'ormconfig';
import * as oracledb from 'oracledb';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectEntityManager()
        private entityManagaer: EntityManager,

        @InjectDataSource()
        private dataSource: DataSource,

        private readonly dbService: DbService,
    ) { }

    async getAllUsers() {
        // return this.userRepository.find();
        try {
            const dataSource = this.dbService.getDataSource();
            const users = await dataSource.getRepository(User).find();
            return users;
        }
        catch (err) {
            return this.userRepository.find();
        }
    }

    async closeDbDataSourceConnection() {
        try {
            const dataSource = this.dbService.getDataSource();
            if (dataSource) {
                console.log(
                    dataSource.options
                );
                return this.dbService.closeConnection();
            }
        }
        catch (err) {
            return "No Connection Detected to close";
        }
    }

    async getDbDataSourceConnection(type: string) {
        try {
            const dataSource = this.dbService.getDataSource();
            if (dataSource.options.type !== type) {
                throw new Error("DB Shifting")
            }
            return 'Connection successfull1';
        }
        catch (err) {
            const conn = this.dbService.initialize(this.dbService.getDbTypeConfig(type))
            const dataSource = this.dbService.getDataSource();
            return "Connection successfull2";
        }
    }

    async createUser(userDto) {
        const user = await this.userRepository.findOne({
            where: { email: userDto.email }
        })
        if (user) {
            return "User Already exist"
        }

        let newUser = this.userRepository.create(userDto);
        newUser = await this.userRepository.save(newUser);
        return newUser;
    }

    async getAllUsersByDBF() {
        const queryRunner = this.userRepository.manager.connection.createQueryRunner();
        if (dbType === 'mssql') {
            const result = await queryRunner.query(`SELECT * from getAllUsersF()`);
            console.log(result);

            await queryRunner.release();
            return result;
        }
        else if (dbType === 'mysql') {
            return { message: "This type of operation not supported" }
        }
        else if (dbType === 'oracle') {
            const result = await queryRunner.query(` SELECT * FROM TABLE(get_my_table_data())`);
            await queryRunner.release();
            return result;
        }

        // const result = await queryRunner.query(`SELECT GetEmailById(${id})`);
        //     await queryRunner.release();
        //     return result[0][`GetEmailById(${id})`];

        return '/udf';
    }

    async getEmailByUserIdDBF(id: Number) {
        const queryRunner = this.userRepository.manager.connection.createQueryRunner();
        if (dbType === 'mssql') {
            const result = await queryRunner.query(`SELECT * from getEmailByUserIdF(${id})`);
            await queryRunner.release();
            return result;
        }
        if (dbType === 'mysql') {
            const result = await queryRunner.query(`SELECT GetEmailById(${id})`);
            await queryRunner.release();
            return { email: result[0][`GetEmailById(${id})`] };
        }
        if (dbType === 'oracle') {
            const result = await queryRunner.query(`SELECT getEmailByUserIdDBF(${id}) AS email FROM dual`);
            console.log(result);

            await queryRunner.release();
            return { email: result[0][`EMAIL`] };
        }
        return `/udf/${id}`;
    }

    async getAllUsersByDBSP() {
        const queryRunner = this.userRepository.manager.connection.createQueryRunner();
        if (dbType === 'mssql') {
            const result = await queryRunner.query(`exec getAllUsers`);
            console.log(result);

            await queryRunner.release();
            return result;
        }
        else if (dbType === 'oracle') {
            let connection;
            let cursor;
            let rows = [];
            try {
                // Connect to the Oracle database using oracledb 
                connection = await oracledb.getConnection(config);
                // connection = this.dataSource.manager.connection;

                // Execute the stored procedure and bind the OUT cursor parameter
                const result = await connection.execute(
                    `BEGIN
           getAllUsersByDBSP(:res);
         END;`,
                    [{ type: oracledb.CURSOR, dir: oracledb.BIND_OUT }], // Bind OUT parameter for the cursor
                    { outFormat: oracledb.OUT_FORMAT_OBJECT } // Return results as objects
                );

                // Check if the cursor was returned
                if (result.outBinds && result.outBinds[0]) {
                    cursor = result.outBinds[0]; // The OUT cursor

                    console.log('Cursor successfully returned:', cursor);

                    // Fetch rows in batches
                    let rowsBatch;
                    do {
                        rowsBatch = await cursor.getRows(100); // Adjust number of rows if necessary
                        rows = rows.concat(rowsBatch); // Append fetched rows to the main array
                    } while (rowsBatch.length > 0);

                    console.log('Rows fetched:', rows);
                } else {
                    throw new Error('No cursor returned from the stored procedure');
                }

                // Return all fetched rows
                return rows;

            } catch (err) {
                console.error('Error fetching users: ', err);
                throw new Error('Error fetching users');
            } finally {
                if (connection) {
                    try {
                        await connection.close(); // Close the database connection
                    } catch (err) {
                        console.error('Error closing connection', err);
                    }
                }
            }
        }
        else if (dbType === 'mysql') {
            const result = await queryRunner.query(`call getAllUser()`);
            await queryRunner.release();
            return result[0];
        }
        return '/sp'
    }

    async getEmailByUserIdDBSP(id: Number) {
        const queryRunner = this.userRepository.manager.connection.createQueryRunner();
        if (dbType === 'mssql') {
            const result = await queryRunner.query(`exec getUserEmailUsingId ${id}`);
            console.log(result);

            await queryRunner.release();
            return result;
        }
        else if (dbType === 'oracle') {
            let connection;

            try {
                // Connect to the Oracle database
                connection = await oracledb.getConnection(config); // Use the appropriate config

                // Define input and output parameters
                const userId = id; // Example user ID to search for
                let userEmail = { val: null }; // This will hold the OUT parameter (email)

                // Execute the stored procedure with the input/output parameters
                const result = await connection.execute(
                    `BEGIN
                        GetUserEmailByID(:p_userid, :p_email);
                    END;`,
                    {
                        p_userid: { val: userId, type: oracledb.NUMBER }, // Input parameter
                        p_email: { dir: oracledb.BIND_OUT, type: oracledb.STRING } // OUT parameter
                    },
                    {
                        outFormat: oracledb.OUT_FORMAT_OBJECT // Format the result as objects
                    }
                );

                // Check the result of the OUT parameter
                console.log(result);

                if (result.outBinds) {
                    console.log('User email:', userEmail.val); // Output the email address
                    return { email: result.outBinds.p_email }; // Return the email or process it as needed
                } else {
                    console.log('No email found for the given user ID');
                    return null; // If no email found
                }

            } catch (err) {
                console.error('Error fetching user email:', err);
                throw new Error('Error executing stored procedure');
            } finally {
                if (connection) {
                    try {
                        await connection.close(); // Close the database connection
                    } catch (err) {
                        console.error('Error closing connection:', err);
                    }
                }
            }
        }
        else if (dbType === 'mysql') {
            const result = await queryRunner.query(`call getUserEmailUsingId(${id})`);
            await queryRunner.release();
            return result[0];
        }
        return "/sp/id"
    }


    async getEmailByUserId(id: Number) {
        return '/users/id'
    }

}
