import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '..', '..', 'db', 'urls.json');

function readUrls() {
    if (!fs.existsSync(DB_FILE)) return {};

    const data = fs.readFileSync(DB_FILE, 'utf-8');

    return JSON.parse(data);
}

function writeUrls(urls) {
    fs.writeFileSync(DB_FILE, JSON.stringify(urls, null, 2));
}

function findExistingCode(urls, url) {
    return Object.keys(urls).find((key) => urls[key].url === url) || null;
}

function generateCode(urls) {
    const existingCodes = Object.keys(urls);

    let code = Math.random().toString(36).substring(2, 8);

    while (existingCodes.includes(code)) {
        code = Math.random().toString(36).substring(2, 8);
    }

    return code;
}

function shortenUrl(url, ownerUsername) {
    const urls = readUrls();

    const existingCode = findExistingCode(urls, url);
    if (existingCode) {
        return { code: existingCode, codeCreated: false };
    }

    const newCode = generateCode(urls);

    urls[newCode] = { url, ownerUsername };
    writeUrls(urls);

    return { code: newCode, codeCreated: true };
}

function getOriginalUrl(code) {
    const urls = readUrls();
    return urls[code]?.url || null;
}

export { shortenUrl, getOriginalUrl };
