import mongoose from 'mongoose';

export async function connectDb(dbUrl: string, dbName: string) {
    mongoose.connection.on('error', (error) => {
        console.log('db: Connection Error', error);
        process.exit(1);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('db: Connection Disconnected');
    });

    mongoose.connection.on('reconnected', () => {
        console.log('db: Connection ReConnected');
    });

    mongoose.connection.on('connected', () => {
        console.log(`db: Connected to '${mongoose.connection.db?.databaseName}' database`);
    });

    try {
        await mongoose.connect(dbUrl, { dbName, serverSelectionTimeoutMS: 2_000 });
    } catch (error) {
        console.log('db: Error in Creating connection');
    }
}
