import bcrypt from 'bcrypt';
import pool from '../../db/pool.js';

async function registerUser(username, password) {
    const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

    if (existing.rows.length > 0) {
        return null;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
        [username, passwordHash]
    );

    return result.rows[0];
}

async function loginUser(username, password) {
    const result = await pool.query(
        'SELECT id, username, password_hash FROM users WHERE username = $1',
        [username]
    );

    const user = result.rows[0];
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    return { id: user.id, username: user.username };
}

export { registerUser, loginUser };
