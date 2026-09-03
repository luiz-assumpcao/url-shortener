import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, '..', '..', 'db', 'users.json');

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return {};

    const data = fs.readFileSync(USERS_FILE, 'utf8');

    return JSON.parse(data);
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

async function registerUser(username, password) {
    const users = readUsers();

    if (users[username]) {
        return null;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    users[username] = { passwordHash };
    writeUsers(users);

    return { username };
}

async function loginUser(username, password) {
    const users = readUsers();
    const user = users[username];

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    return { username };
}

export { registerUser, loginUser };
