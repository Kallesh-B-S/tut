import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mssql } from 'ormconfig';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule,TypeOrmModule.forRoot(mssql)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
