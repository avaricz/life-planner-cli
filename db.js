import Database from 'better-sqlite3';
const db = new Database('./lp-cli.db');

db.prepare(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'done')))
`)
.run();


export function getAllTasksFromDb () {
    const statement = db.prepare('SELECT * FROM tasks');
    return statement.all();
}

export function addTaskToDb (task, description = null, status = 'pending') {
    const statement = db.prepare(`
        INSERT INTO tasks (task, description, status)
        VALUES (?, ?, ?)
    `);
    statement.run(task, description, status,);
}

export function changeTaskStatus (taskId, status) {
    const statement = db.prepare(`
        UPDATE tasks
        SET status = ?
        WHERE id = ?
        `);
        statement.run(status, taskId)
}

export function deleteTaskFromDb (taskId) {
    const statement = db.prepare(`
        DELETE FROM tasks
        WHERE id = ?   
    `);
    statement.run(taskId)
}

export function updateTaskInDb (task) {
    const statement = db.prepare(`
        UPDATE tasks
        SET task = ?, description = ?
        WHERE id = ?
        `)
    statement.run(task.task, task.description, task.id)
}