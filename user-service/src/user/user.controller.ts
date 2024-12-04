import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * GET => Замешивает случайных пользователей в бд.
     * @param count парсит count из параметров запроса и замешивает указанное количество пользователей
     * Если count не определен, то замешивает 1000000
     */
    @Get('seed')
    async seedUsers(@Query('count') count: number) {
        const numUsers = parseInt(String(count), 10) || 1000000;
        await this.userService.seedUsers(numUsers);
        return { message: `Successfully added ${numUsers} users` };
    }

    /**
     * GET => Проверяет у кого из пользователей установлен hasProblems в значении true и возвращает в false
     * Возвращает количество пользователей, у которых значение было обновлено.
     */
    @Get('reset-problems')
    async resetProblems() {
        const count = await this.userService.resetProblems();
        return { message: `${count} users had problems reset to false` };
    }
}
