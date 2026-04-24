import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, fallback = ''): string => {
  const value = process.env[key] ?? fallback;
  if (!value && fallback === '') {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};

export const env = {
  port: Number(getEnv('PORT', '4000')),
  databaseUrl: getEnv('DATABASE_URL'),
  jwtSecret: getEnv('JWT_SECRET'),
  stripeSecretKey: getEnv('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: getEnv('STRIPE_WEBHOOK_SECRET'),
  awsRegion: getEnv('AWS_REGION'),
  awsBucket: getEnv('AWS_S3_BUCKET'),
  awsAccessKeyId: getEnv('AWS_ACCESS_KEY_ID'),
  awsSecretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY'),
  paymobApiKey: getEnv('PAYMOB_API_KEY'),
  frontendUrl: getEnv('FRONTEND_URL'),
};
