import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    getAllUsers() {
        return this.userRepository.find();
    } 
    
    async createUser(userDto){
        const user = await this.userRepository.findOne({
            where:{email:userDto.email}
        })
        if(user){
            return "User Already exist"
        }

        let newUser = this.userRepository.create(userDto);
        newUser = await this.userRepository.save(newUser);
        return newUser;
    }
}
