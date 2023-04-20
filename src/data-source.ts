import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "dst",
    password: "password",
    database: "dst",
    synchronize: true,
    logging: false,
    entities: [
        __dirname + "/entity/**/*.ts"
    ]
})

AppDataSource.initialize();