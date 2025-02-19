import { Module } from '@nestjs/common';
import { XmlService } from './xml.service';
import { XmlController } from './xml.controller';

@Module({
  providers: [XmlService],
  controllers: [XmlController]
})
export class XmlModule {}
