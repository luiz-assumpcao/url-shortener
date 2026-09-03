import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controllers.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
    }

    const user = await registerUser(username, password);

    if (!user) {
        return res.status(409).json({ error: 'username already taken' });
    }

    res.status(201).json(user);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
    }

    const loginResult = await loginUser(username, password);

    if (!loginResult) {
        return res.status(401).json({ error: 'invalid username or password' });
    }

    res.status(200).json({ message: 'login successful', user: loginResult });
});

export default router;
