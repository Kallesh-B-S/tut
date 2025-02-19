import { Controller, Get, Param } from '@nestjs/common';
import { XmlService } from './xml.service';

@Controller('xml')
export class XmlController {
    constructor(private readonly xmlService:XmlService){}

    @Get('/:type')
    xlmToJson(@Param('type') type:'mysql'|'oracle'|'mssql'){
        return this.xmlService.xlmToJson(type);
    }
}
