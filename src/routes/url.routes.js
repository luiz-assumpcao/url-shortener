import { Router } from 'express';
import {
    shortenUrl,
    getOriginalUrl,
    getUserUrls,
    deleteUrl
} from '../controllers/url.controllers.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/shorten', authenticate, async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'url is required' });
    }

    const { code } = await shortenUrl(url, req.userId);

    res.status(201).json({ message: 'URL shortened successfully', code, url });
});

router.get('/urls', authenticate, async (req, res) => {
    const userUrls = await getUserUrls(req.userId);
    res.json(userUrls);
});

router.get('/:code', async (req, res) => {
    const { code } = req.params;

    const originalUrl = await getOriginalUrl(code);

    if (!originalUrl) {
        return res.status(404).json({ error: 'code not found' });
    }

    res.redirect(originalUrl);
});

router.delete('/:code', authenticate, async (req, res) => {
    const { code } = req.params;

    const deletedUrl = await deleteUrl(code, req.userId);

    if (!deletedUrl) {
        return res.status(404).json({ error: 'code not found' });
    }

    res.json({ message: 'URL deleted successfully', deletedUrl });
});

export default router;
