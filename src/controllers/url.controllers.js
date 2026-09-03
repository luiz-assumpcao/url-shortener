import pool from '../../db/pool.js';

function generateCode() {
    return Math.random().toString(36).substring(2, 8);
}

async function shortenUrl(url, ownerId) {
    let code;
    let result;
    let inserted = false;

    while (!inserted) {
        code = generateCode();

        try {
            result = await pool.query(
                'INSERT INTO urls (code, url, owner_id) VALUES ($1, $2, $3) RETURNING code',
                [code, url, ownerId]
            );
            inserted = true;
        } catch (error) {
            if (error.code !== '23505') throw error; // 23505 = unique_violation, code already taken, try another.
        }
    }

    return { code: result.rows[0].code };
}

async function getOriginalUrl(code) {
    const result = await pool.query('SELECT url FROM urls WHERE code = $1', [code]);
    return result.rows[0]?.url || null;
}

export { shortenUrl, getOriginalUrl };
