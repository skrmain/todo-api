import express from 'express';

import BaseRoute from './routes';

const PORT = process.env.PORT || 8000;
const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Server Running...' });
});

app.use(BaseRoute);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
