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

const dbConfig = {
    connectionString: process.env.DATABASE_URL
};

if (process.env.NODE_ENV === "production") {
    dbConfig.ssl = {
        rejectUnauthorized: false
    };
}

const pool = new pg.Pool(dbConfig);

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

// app.get("/todo/tasks", (req, res, next) => {
//     pool.query('SELECT * FROM tasks').then((data) => {
//             console.log(data);
//             res.send(data.rows);
//         })
//         .catch(next)
// });

// app.get("/todo/:id", (req, res, next) => {
//     pool.query('SELECT * FROM lists WHERE list_id = $1', [id]).then((data) => {
//             if (data.rows[0]) {
//                 res.send(data.rows[0]);
//             } else {
//                 res.sendStatus(404);
//             }
//         })
//         .catch(next)
// });


// app.get("/todo/tasks/:id", (req, res, next) => {
//     const id = req.params.id;
//     pool.query('SELECT * FROM tasks WHERE list_id = $1', [id]).then((data) => {
//             if (data.rows[0]) {
//                 res.send(data.rows[0]);
//             } else {
//                 res.sendStatus(404);
//             }
//         })
//         .catch(next)
// });

app.post("/todo", (req, res, next) => {
    const { name, list_id } = req.body;
    pool.query('INSERT INTO tasks (name, list_id) VALUES ($1, $2) RETURNING *;', [name, list_id])
        .then((data) => {
            res.send(data.rows[0])
        })
        .catch(next)
})

app.delete("/todo", (req, res, next) => {
    const { name } = req.body;
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