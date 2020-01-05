import path from 'path';

import dotenvSafe from 'dotenv-safe';

const cwd = process.cwd();

const root = path.join.bind(cwd);

const ENV = process.env;

if (!process.env.NOW_REGION) {
  dotenvSafe.config({
    allowEmptyValues: process.env.NODE_ENV !== 'production',
    path: root('.env.local'),
    example: root('.env.example'),
  });
}

// Server
export const GRAPHQL_PORT = ENV.GRAPHQL_PORT || 5001;

// Export some settings that should always be defined
export const MONGO_URL = ENV.MONGO_URL || 'mongodb://localhost/database';

export const JWT_SECRET = ENV.JWT_KEY || 'secret_key';
