import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as casual from 'casual';
import {User} from "./entities/user/user";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    /**
     * Генерирует и вставляет большое количество случайных пользователей в базу данных
     * @param {number} count - сколько сгенерировать пользователей и вставить в базу данных
     * @returns {Promise<{ inserted: number }>} - возвращает промис с объектом, в котором содержится количество успешно добавленныхь пользователей
     */
    async seedUsers(count: number): Promise<{ inserted: number }> {
        const batchSize = 1000; // Добавляем пользователей по 1000
        let inserted = 0;

        for (let i = 0; i < count; i += batchSize) {
            // Сгенени
            const users = Array.from({ length: Math.min(batchSize, count - i) }).map(() => ({
                firstName: casual.first_name,
                lastName: casual.last_name,
                age: casual.integer(1, 80),
                gender: casual.random_element(['male', 'female']),
                hasProblems: casual.boolean, // Correct field name
            }));

            // Batch insert
            await this.userRepository.insert(users);
            inserted += users.length;

            console.log(`Inserted ${inserted} users so far`);
        }
        return { inserted };
    }

    /**
     * Обновляет флаг hasProblems для всех пользорвателей со значением true
     * @returns {Promise<number>} - возвращает количество пользователей, у которых значение было изменено
     */
    async resetProblems(): Promise<number> {
        const count = await this.userRepository.count({
            where: { hasProblems: true },
        });
        await this.userRepository.update({ hasProblems: true }, { hasProblems: false });
        return count;
    }
}
