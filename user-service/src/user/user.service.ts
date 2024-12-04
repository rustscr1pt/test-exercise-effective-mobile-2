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

    async seedUsers(count: number): Promise<{ inserted: number }> {
        const batchSize = 1000; // Insert users in batches of 1000
        let inserted = 0;

        for (let i = 0; i < count; i += batchSize) {
            // Generate batch of users
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

    async resetProblems(): Promise<number> {
        const count = await this.userRepository.count({
            where: { hasProblems: true },
        });
        await this.userRepository.update({ hasProblems: true }, { hasProblems: false });
        return count;
    }
}
