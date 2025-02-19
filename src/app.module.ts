import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {config} from 'ormconfig';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { XmlModule } from './xml/xml.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(config),
    DbModule,
    XmlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
