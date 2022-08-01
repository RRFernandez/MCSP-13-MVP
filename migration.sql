CREATE TABLE lists (
    list_id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    name TEXT,
    list_id INTEGER REFERENCES lists(list_id)
);