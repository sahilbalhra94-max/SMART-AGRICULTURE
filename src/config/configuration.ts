import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'agrismart-backend',
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  env: process.env.APP_ENV || 'development',
  apiPrefix: process.env.APP_API_PREFIX || 'api/v1',
  corsOrigin: process.env.APP_CORS_ORIGIN || 'http://localhost:5173',
}));

export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
}));

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret',
  expiration: process.env.JWT_EXPIRATION || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));

export const openaiConfig = registerAs('openai', () => ({
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-4o',
}));

export const s3Config = registerAs('s3', () => ({
  region: process.env.AWS_REGION || 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.AWS_S3_BUCKET || 'agrismart-files',
}));

export const weatherConfig = registerAs('weather', () => ({
  apiKey: process.env.WEATHER_API_KEY,
  apiUrl: process.env.WEATHER_API_URL || 'https://api.weatherapi.com/v1',
}));

export const mqttConfig = registerAs('mqtt', () => ({
  brokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
  username: process.env.MQTT_USERNAME || undefined,
  password: process.env.MQTT_PASSWORD || undefined,
}));
