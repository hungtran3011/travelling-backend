import { createClient } from "redis";

class RedisService {
    private client: ReturnType<typeof createClient>;
    
    constructor() {
        this.client = createClient({
        url: process.env.REDIS_URL,
        });
    
        this.client.on("error", (err) => {
        console.error("Redis Client Error", err);
        });
    }
    
    async connect() {
        await this.client.connect();
    }
    
    async disconnect() {
        await this.client.quit();
    }

    async set(key: string, value: string) {
        await this.client.set(key, value);
    }

    async get(key: string) {
        return await this.client.get(key);
    }

    async del(key: string) {
        await this.client.del(key);
    }

    async exists(key: string) {
        return await this.client.exists(key);
    }
    
    async expire(key: string, seconds: number) {
        await this.client.expire(key, seconds);
    }

    async hset(key: string, field: string, value: string) {
        await this.client.hSet(key, field, value);
    }

    async hget(key: string, field: string) {
        return await this.client.hGet(key, field);
    }

    async hdel(key: string, field: string) {
        await this.client.hDel(key, field);
    }

    async hgetall(key: string) {
        return await this.client.hGetAll(key);
    }

    async hkeys(key: string) {
        return await this.client.hKeys(key);
    }

    async hvals(key: string) {
        return await this.client.hVals(key);
    }

    async hlen(key: string) {
        return await this.client.hLen(key);
    }

    async hsetnx(key: string, field: string, value: string) {
        return await this.client.hSetNX(key, field, value);
    }

    async hscan(key: string, cursor: number, options?: { MATCH?: string; COUNT?: number }) {
        return await this.client.hScan(key, cursor, options);
    }

    getClient() {
        return this.client;
    }
}

const redisService = new RedisService();
export default redisService;