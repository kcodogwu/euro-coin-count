'use strict';

import redis from 'redis';

const redisClient = redis.createClient({ host: '172.17.0.1', port: 6379 });

redisClient.on('connect', () => console.log('Connected to the database'));

export { redisClient };