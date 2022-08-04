import express from "express";
import fs from "fs/promises";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use(express.static('static'));

app.use(express.json());

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const unknownHTTP = (req, res, next) => {
    res.sendStatus(404);
    next();
};

app.get("/todo", (req, res, next) => {
    pool.query('SELECT * FROM tasks').then((data) => {
            console.log(data);
            res.send(data.rows);
        })
        .catch(next)
});

app.post("/todo", (req, res, next) => {
    const { name, list_id } = req.body;
    pool.query('INSERT INTO tasks (name, list_id) VALUES ($1, $2) RETURNING *;', [name, list_id])
        .then((data) => {
            res.send(data.rows[0])
        })
        .catch(next)
})

app.delete("/todo/:name", (req, res, next) => {
    const { name } = req.params;
    pool.query('DELETE FROM tasks WHERE name = $1 RETURNING *;', [name])
        .then((data) => {
            console.log(data.rows[0])
            console.log("DELETE REQ")
            res.sendStatus(204);
        })
        .catch(next);
})

app.use(unknownHTTP);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendStatus(500)
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});