import express from "express";
import fs from "fs/promises";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use(express.static('static'));

const dbConfig = {
    connectionString: process.env.DATABASE_URL
};

if (process.env.NODE_ENV === "production") {
    dbConfig.ss = {
        rejectUnauthorized: false
    };
}

const pool = new pg.Pool(dbConfig);

app.get("/todo", (req, res, next) => {
    pool.query('SELECT * FROM lists').then((data) => {
            console.log(data);
            res.send(data.rows);
        })
        .catch(next)
});

app.get("/todo/tasks", (req, res, next) => {
    pool.query('SELECT * FROM tasks').then((data) => {
            console.log(data);
            res.send(data.rows);
        })
        .catch(next)
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});