import { Router } from 'express';
import { shortenUrl, getOriginalUrl } from '../controllers/url.controllers.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/shorten', authenticate, async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'url is required' });
    }

    const { code, codeCreated } = await shortenUrl(url, req.userId);

    if (!codeCreated) {
        return res.status(200).json({ message: 'URL already shortened previously', code, url });
    }

    res.status(201).json({ message: 'URL shortened successfully', code, url });
});

router.get('/:code', async (req, res) => {
    const { code } = req.params;

    const originalUrl = await getOriginalUrl(code);

    if (!originalUrl) {
        return res.status(404).json({ error: 'code not found' });
    }

    res.redirect(originalUrl);
});

export default router;
