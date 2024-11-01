// src/cache.service.ts

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
export enum CACHE_KEYS {
  BAG_SYNC_BLOCK_COUNT,
  ABC,
}

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async get<T>(key: CACHE_KEYS): Promise<T | undefined> {
    const value = await this.cacheManager.get(key.toString());
    return value as T | undefined;
  }

  // Set method with type safety
  async set<T>(key: CACHE_KEYS, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key.toString(), value);
  }

  // Delete method with type safety
  async delete(key: keyof typeof CACHE_KEYS): Promise<void> {
    await this.cacheManager.del(key);
  }
}
