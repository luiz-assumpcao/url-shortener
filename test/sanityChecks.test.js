import pool from '../db/pool.js';

describe('test environment setup', () => {
    test('loads environment variables from .env.test', () => {
        expect(process.env.DATABASE_URL).toContain('url_shortener_test');
    });

    test('has a JWT_SECRET defined', () => {
        expect(process.env.JWT_SECRET).toBeDefined();
        expect(process.env.JWT_SECRET.length).toBeGreaterThan(0);
    });

    test('connects to the test database successfully', async () => {
        const result = await pool.query('SELECT 1 AS value');
        expect(result.rows[0].value).toBe(1);
    });
});
