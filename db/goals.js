import db from "./db.js";

db.prepare(`CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal TEXT NOT NULL)
`).run()

export function getAllGoalsFromDb () {
    const statement = db.prepare(`SELECT * FROM goals`);
    return statement.all();
}

export function addGoalToDb (goal) {
    const statement = db.prepare(`
        INSERT INTO goals (goal) VALUES (?)
        `);
    statement.run(goal);
}

export function deleteGoalFromDb (goalId) {
    console.log(goalId)
    const statement = db.prepare(`
        DELETE FROM goals
        WHERE id = ?
        `)
    statement.run(goalId)
}

export function updatedGoalInDb (goal) {
    const statement = db.prepare(`
        UPDATE goals
        SET goal = ?
        WHERE id = ?
        `)
    statement.run(goal.goal, goal.id)
}