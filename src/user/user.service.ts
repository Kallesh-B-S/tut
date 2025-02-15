import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectEntityManager()
        private entityManagaer: EntityManager,
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

    async getEmailByUserId(id:Number){
        const queryRunner = this.userRepository.manager.connection.createQueryRunner();
        const result = await queryRunner.query(`SELECT GetEmailById(${id})`);
        await queryRunner.release();
        return result[0][`GetEmailById(${id})`];
    }

    async getAllUsersByProcedure(){
        const queryRunner = this.userRepository.manager.connection.createQueryRunner();
        const result = await queryRunner.query(`call getAllUser()`);
        await queryRunner.release();
        return result[0];
    }
}
