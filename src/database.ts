import { DataSource } from "typeorm";

export const db = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: process.env.DEBUG === 'true',
    entities: [
        __dirname + '/models/*.{ts,js}',
    ],
});

db.initialize();