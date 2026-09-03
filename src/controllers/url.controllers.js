import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '..', '..', 'urls.json');

function readUrls() {
    if (!fs.existsSync(DB_FILE)) return {};

    const content = fs.readFileSync(DB_FILE, 'utf-8');

    return JSON.parse(content);
}

function writeUrls(urls) {
    fs.writeFileSync(DB_FILE, JSON.stringify(urls, null, 2));
}

function generateCode(urls, url) {
    const existingCodes = Object.keys(urls);
    const existingUrls = Object.values(urls);

    if (existingUrls.includes(url)) {
        return Object.keys(urls).find((key) => urls[key] === url);
    }

    let code = Math.random().toString(36).substring(2, 8);

    while (existingCodes.includes(code)) {
        code = Math.random().toString(36).substring(2, 8);
    }

    return code;
}

function shortenUrl(url) {
    const urls = readUrls();
    const code = generateCode(urls, url);

    urls[code] = url;
    writeUrls(urls);

    return code;
}

function getOriginalUrl(code) {
    const urls = readUrls();
    return urls[code] || null;
}

export { shortenUrl, getOriginalUrl };
