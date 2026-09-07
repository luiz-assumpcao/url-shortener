import request from 'supertest';
import app from '../src/app.js';

async function getAuthToken(username = 'luiz') {
    await request(app).post('/auth/register').send({ username, password: 'senha123' });

    const loginResponse = await request(app)
        .post('/auth/login')
        .send({ username, password: 'senha123' });

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

describe('GET /urls', () => {
    test('returns the list of URLs for the authenticated user', async () => {
        const token = await getAuthToken();

        const response = await request(app).get('/urls').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('rejects the request when no token is provided', async () => {
        const response = await request(app).get('/urls');

        expect(response.status).toBe(401);
    });
});

describe('DELETE /:code', () => {
    test('deletes the URL when the code exists and belongs to the user', async () => {
        const token = await getAuthToken();

        const shortenResponse = await request(app)
            .post('/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({ url: 'https://example.com' });

        const { code } = shortenResponse.body;

        const response = await request(app)
            .delete(`/${code}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    test('returns 404 when trying to delete a code that exists but does not belong to the user', async () => {
        const ownerToken = await getAuthToken('owner');
        const otherToken = await getAuthToken('intruder');

        const shortenResponse = await request(app)
            .post('/shorten')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ url: 'https://example.com' });

        const { code } = shortenResponse.body;

        const response = await request(app)
            .delete(`/${code}`)
            .set('Authorization', `Bearer ${otherToken}`);

        expect(response.status).toBe(404);
    });

    test('returns 404 when trying to delete a code that does not exist', async () => {
        const token = await getAuthToken();

        const response = await request(app)
            .delete('/nonexistentcode')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    test('rejects the request when no token is provided', async () => {
        const response = await request(app).delete('/nonexistentcode');
        expect(response.status).toBe(401);
    });
});
