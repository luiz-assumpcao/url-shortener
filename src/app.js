import 'dotenv/config';
import express from 'express';
import urlRoutes from './routes/url.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/', urlRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
