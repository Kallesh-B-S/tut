import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService:UserService){}

    @Get()
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Post()
    createUser(@Body() user){
        return this.userService.createUser(user);
    }
}
