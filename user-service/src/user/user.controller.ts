import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('seed')
    async seedUsers(@Query('count') count: number) {
        const numUsers = parseInt(String(count), 10) || 1000000;
        await this.userService.seedUsers(numUsers);
        return { message: `Successfully added ${numUsers} users` };
    }

    @Get('reset-problems')
    async resetProblems() {
        const count = await this.userService.resetProblems();
        return { message: `${count} users had problems reset to false` };
    }
}
