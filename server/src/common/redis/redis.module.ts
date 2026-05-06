import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
    providers: [
        {
            provide: 'REDIS',
            useFactory: () => {
                const redis = new Redis({
                    host: process.env.REDIS_HOST || 'localhost',
                    port: Number(process.env.REDIS_PORT) || 6379,
                });

                redis.on('connect', () => {
                    console.log('Redis connected 🚀');
                });

                redis.on('error', (err) => {
                    console.error('Redis error ❌', err);
                });

                return redis;
            },
        },
    ],
    exports: ['REDIS'],
})
export class RedisModule { }