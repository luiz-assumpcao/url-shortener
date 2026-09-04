import express from 'express';
import urlRoutes from './routes/url.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());

app.use('/', urlRoutes);
app.use('/auth', authRoutes);

export default app;
