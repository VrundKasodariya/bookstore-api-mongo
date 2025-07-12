import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let dbConnection;
let uri = process.env.MONGO_URI;

export const connectToDb = (cb) => {
    MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db();
            return cb();
        })
        .catch((err) => {
            console.error(err);
            return cb(err);
        });
};

export const getDb = () => dbConnection;
