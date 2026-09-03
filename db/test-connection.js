import 'dotenv/config';
import pool from './pool.js';

async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Connected successfully. Server time:', result.rows[0].now);
    } catch (error) {
        console.error('Connection failed:', error.message);
    } finally {
        await pool.end();
    }
}

testConnection();
