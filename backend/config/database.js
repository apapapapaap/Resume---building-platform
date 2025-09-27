import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || 'resume_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'resume_platform',
  password: process.env.DB_PASSWORD || 'secure_password_123',
  port: process.env.DB_PORT || 5433,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(dbConfig);

export async function connectDatabase() {
  try {
    await pool.connect();
    console.log('📊 Connected to PostgreSQL database');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
}

export const query = (text, params) => pool.query(text, params);
export default pool;
