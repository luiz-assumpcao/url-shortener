const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'urls.json');

app.use(express.json());

function readUrls() {
    if (!fs.existsSync(DB_FILE)) return {};
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
}

function writeUrls(urls) {
    fs.writeFileSync(DB_FILE, JSON.stringify(urls, null, 2));
}

function generateCode(urls) {
    const existingCodes = Object.keys(urls);
    let code = Math.random().toString(36).substring(2, 8);
    while (existingCodes.includes(code)) {
        code = Math.random().toString(36).substring(2, 8);
    }
    return code;
}

app.post('/shorten', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'url is required' });
    }

    const urls = readUrls();
    const code = generateCode(urls);

    urls[code] = url;
    writeUrls(urls);

    res.status(201).json({ code, url });
});

app.get('/:code', (req, res) => {
    const { code } = req.params;
    const urls = readUrls();

    const originalUrl = urls[code];

    if (!originalUrl) {
        return res.status(404).json({ error: 'code not found' });
    }

    res.redirect(originalUrl);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
