import { createServer } from './server.js';

const PORT = 8000;

const server = createServer();

server.on('listening', () => {
    console.log(`Server is listening on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.listen(PORT);
