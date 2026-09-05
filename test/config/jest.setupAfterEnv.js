import pool from '../../db/pool.js';

beforeEach(async () => {
    await pool.query('DELETE FROM urls');
    await pool.query('DELETE FROM users');
});

afterAll(async () => {
    await pool.end();
});
