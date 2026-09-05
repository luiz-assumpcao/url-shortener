import request from 'supertest';
import app from '../src/app.js';

describe('POST /auth/register', () => {
    test('creates a new user and returns id and username', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({ username: 'luiz', password: 'senha123' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe('luiz');
    });

    test('rejects registration when username is already taken', async () => {
        await request(app).post('/auth/register').send({ username: 'luiz', password: 'senha123' });

        const response = await request(app)
            .post('/auth/register')
            .send({ username: 'luiz', password: 'outraSenha' });

        expect(response.status).toBe(409);
    });
});

describe('POST /auth/login', () => {
    test('returns a token when credentials are correct', async () => {
        await request(app).post('/auth/register').send({ username: 'luiz', password: 'senha123' });

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'luiz', password: 'senha123' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('rejects login when credentials are incorrect', async () => {
        await request(app).post('/auth/register').send({ username: 'luiz', password: 'senha123' });

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'luiz', password: 'senhaErrada' });

        expect(response.status).toBe(401);
    });
});
