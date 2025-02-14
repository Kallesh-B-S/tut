import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'users'})
export class User{
    @PrimaryGeneratedColumn()
    id:Number

    @Column({length:50,unique:true,nullable:false})
    email:String

    @Column({length:50})
    firstName:String

    @Column({length:50})
    lastName:String
    
    @Column({length:50})
    city:String
}