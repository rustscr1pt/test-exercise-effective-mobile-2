import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {User} from "./entities/user/user";

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register the User entity
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Export the service if needed in other modules
})
export class UserModule {}
