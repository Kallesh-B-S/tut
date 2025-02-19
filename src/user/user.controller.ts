import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Res, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';


@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('udf/:id')
    async getEmailByUserIdDBF(@Param('id', ParseIntPipe) id:number) {
       return this.userService.getEmailByUserIdDBF(id)
    }

    // In MySQL, user-defined functions (UDFs) cannot return a table directly. 
    // Instead, they can only return a single value (like an integer, string, etc.). 
    // If you want to return a result set (like a table), 
    // you should use a stored procedure or a view.
    @Get('udf')
    async getAllUsersByDBF(@Res() res: Response,) {
        const result = await this.userService.getAllUsersByDBF()
        if(result && result.message){
            return res.status(400).send(result)
        }
        return res.status(200).send(result)
    }

    //  procedures do not return results directly, while functions do.
  
    @Get('sp/:id')
    getEmailByUserIdDBSP(@Param('id',ParseIntPipe) id:Number){
        return this.userService.getEmailByUserIdDBSP(id);
    }

    @Get('sp')
    getAllUsersByDBSP(){
        return this.userService.getAllUsersByDBSP();
    }

    @Get()
    getUserDetails(@Query('id') id: Number) {
        if (id) {
            return this.userService.getEmailByUserId(id)
        }
        else {
            return this.userService.getAllUsers();
        }
    }

    @Get('/closeConnection')
    closeDbDataSourceConnection(){
        return this.userService.closeDbDataSourceConnection();
    }

    @Get('/getConnection/:type')
    getDbDataSourceConnection(@Param('type') type:string){
        return this.userService.getDbDataSourceConnection(type);
    }

    @Post()
    createUser(@Body() user) {
        return this.userService.createUser(user);
    }

    @Post('/t1')
    @UseInterceptors(FileInterceptor('file'))
    testPostMethod(@Body() body: any) {
        return body.p1;
    }

    
}
