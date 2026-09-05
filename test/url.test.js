import request from 'supertest';
import app from '../src/app.js';

async function getAuthToken() {
    await request(app).post('/auth/register').send({ username: 'luiz', password: 'senha123' });

    const loginResponse = await request(app)
        .post('/auth/login')
        .send({ username: 'luiz', password: 'senha123' });

    return loginResponse.body.token;
}

describe('POST /shorten', () => {
    test('rejects the request when no token is provided', async () => {
        const response = await request(app).post('/shorten').send({ url: 'https://example.com' });

        expect(response.status).toBe(401);
    });

    test('creates a shortened URL when a valid token is provided', async () => {
        const token = await getAuthToken();

        const response = await request(app)
            .post('/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({ url: 'https://example.com' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('code');
    });
});

describe('GET /:code', () => {
    test('redirects to the original URL when the code exists', async () => {
        const token = await getAuthToken();

        const shortenResponse = await request(app)
            .post('/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({ url: 'https://example.com' });

        const { code } = shortenResponse.body;

        const response = await request(app).get(`/${code}`);

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('https://example.com');
    });

    test('returns 404 when the code does not exist', async () => {
        const response = await request(app).get('/nonexistentcode');
        expect(response.status).toBe(404);
    });
});
