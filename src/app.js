import express from 'express';
import urlRoutes from './routes/url.routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/', urlRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
