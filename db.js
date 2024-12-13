import Database from 'better-sqlite3';
const db = new Database('./lp-cli.db');

db.prepare(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending')
`)
.run();

console.log('Tabulka "tasks" byla vytvořena nebo již existuje.');


export function addTaskToDb(task, description = null, status = 'pending') {
    const statement = db.prepare(`
        INSERT INTO tasks (task, description, status)
        VALUES (?, ?, ?)
    `);
    statement.run(task, description, status,);
}

export function getAllTasksFromDb() {
    const statement = db.prepare('SELECT * FROM tasks');
    return statement.all();
}

