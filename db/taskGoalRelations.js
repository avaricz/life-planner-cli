import db from "./db.js";

db.prepare(`CREATE TABLE IF NOT EXISTS task_goal_relations (
   task_id INTEGER NOT NULL,
   goal_id INTEGER NOT NULL,
   PRIMARY KEY (task_id, goal_id),
   FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
   FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
   )`)
.run();

export function addTaskGoalRelation (taskId, goalId) {
    const statement = db.prepare(`
        INSERT INTO task_goal_relations (task_id, goal_id)
        VALUES (?, ?)
    `);
    statement.run(taskId, goalId);
}

export function removeTaskGoalRelation(taskId, goalId) {
    const statement = db.prepare(`
        DELETE FROM task_goal_relations
        WHERE task_id = ? AND goal_id = ?
    `);
    statement.run(taskId, goalId);
}

export function getTasksForGoal (goalId) {
    const statement = db.prepare(`
        SELECT tasks.* FROM tasks
        JOIN task_goal_relations ON tasks.id = task_goal_relations.task_id
        WHERE task_goal_relations.goal_id = ?
        `);
        return statement.all(goalId);
}

export function getGoalForTask (taskId) {
    const statement = db.prepare(`
        SELECT goals.* FROM goals
        JOIN task_goal_relations ON goals.id = task_goal_relations.goal_id
        WHERE task_goal_relations.task_id = ?
        `);
        return statement.all(taskId)
}

export function getTasksWithoutGoal () {
    const statement = db.prepare(`
        SELECT tasks.* FROM tasks
        LEFT JOIN task_goal_relations ON tasks.id = task_goal_relations.task_id
        WHERE task_goal_relations.goal_id IS NULL
        `);
    return statement.all();
}