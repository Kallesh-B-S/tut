import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    createUser(@Body() user) {
        return this.userService.createUser(user);
    }

    @Post('/t1')
    @UseInterceptors(FileInterceptor('file'))
    testPostMethod(@Body() body: any) {
        return body.p1;
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

    @Get('s')
    getAllUsersByProcedure(){
        return this.userService.getAllUsersByProcedure();
    }

    @Get(':id')
    getEmailByUserId(@Param('id', ParseIntPipe) id) {
        return this.userService.getEmailByUserId(id)
    }

    
}
