import { Router } from 'express';
import { shortenUrl, getOriginalUrl } from '../controllers/url.controllers.js';

const router = Router();

router.post('/shorten', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'url is required' });
    }

    const code = shortenUrl(url);

    res.status(201).json({ code, url });
});

router.get('/:code', (req, res) => {
    const { code } = req.params;

    const originalUrl = getOriginalUrl(code);

    if (!originalUrl) {
        return res.status(404).json({ error: 'code not found' });
    }

    res.redirect(originalUrl);
});

export default router;
