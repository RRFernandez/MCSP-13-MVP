import express from "express";
import pg from "pg";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use(express.static('static'));

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/api/todo', (res, req, next) => {
    pool.query('SELECT * FROM todo').then((data) => {
            res.send(data.rows);
        })
        .catch(next)
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});