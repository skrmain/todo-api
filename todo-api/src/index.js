const { app } = require('./server');

const utils = require('./shared/utils');
const config = require('./config');

(async () => {
    try {
        await utils.connectMongoDB();
        app.listen(config.port, () => console.log(`[Server] Listening on ${config.port}`));
    } catch (error) {
        console.log('[Error] ', error);
        process.exit(0);
    }
})();

process.on('unhandledRejection', (error) => {
    console.log('[unhandledRejection] ', error);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.log('[uncaughtException] ', error);
    process.exit(1);
});
