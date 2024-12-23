import inquirer from 'inquirer';
import chalk from 'chalk';
import { addTaskToDb, getAllTasksFromDb, changeTaskStatus, deleteTaskFromDb, updateTaskInDb } from './db/tasks.js';
import { getAllGoalsFromDb, addGoalToDb, updatedGoalInDb, deleteGoalFromDb } from './db/goals.js';
import { addTaskGoalRelation, getGoalForTask, getTasksForGoal, getTasksWithoutGoal, removeTaskGoalRelation } from './db/taskGoalRelations.js';

const mainMenu = async () => {
    console.log(chalk.blue.bold('Life Planner CLI!'));
    console.log()

    const choices = [
        'Goals',
        'Add a new task',
        'View all tasks',
        'Exit',
    ];

    const { option } = await inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices,
        },
    ]);

    switch (option) {
        case 'Goals':
            await viewGoals();
            break;
        case 'Add a new task':
            await addTask();
            break;
        case 'View all tasks':
            await viewTasks();
            break;
        case 'Exit':
            console.log(chalk.green('Goodbye!'));
            process.exit(0);
    }

    await mainMenu();
};

const viewGoals = async () => {
    const allGoals = getAllGoalsFromDb()

    console.clear()
    console.log(chalk.yellow('GOALS:'));

    allGoals.forEach(goal => {
        console.log(chalk.blue.bold(goal.goal))
    })

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Select option:',
            choices: [
                'Create goal',
                'Select goal',
                'Go back to main menu',
            ],
        },
    ]);

    if (action === 'Create goal') {
        await addGoal();
    }
    if (action === 'Select goal') {
        console.clear()
        await selectGoalView(allGoals);
    }
    if (action === 'Go back to main menu') {
        console.clear()
        await mainMenu();
    }
}

const addGoal = async () => {
    const { goal } = await inquirer.prompt([
        {
            type: 'input',
            name: 'goal',
            message: 'Enter the goal'
        }
    ])

    addGoalToDb(goal)
    console.clear()
    console.log(chalk.green(`Goal added: "${goal}"`));
    await viewGoals()
}

const selectGoalView = async (goals) => {
    const { selectedGoal } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedGoal',
            message: 'Select goal:',
            choices: goals.map(goal => ({
                name: chalk.blue.bold(goal.goal),
                value:  goal
            }))
        }
    ])

    console.clear()

    const tasksForSelectedGoal = getTasksForGoal(selectedGoal.id)
    .map((task, index) => {
        return task.status === 'done' 
        ? `${chalk.green(task.task)} ` 
        : `${chalk.red(task.task)} `
    })

    console.log(`${chalk.yellow('Goal:')} ${chalk.blue.bold(selectedGoal.goal)}
${chalk.yellow('Tasks:')} [ ${tasksForSelectedGoal}]
        `)

    console.log()

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Select option',
            choices: [
                'Edit goal',
                'Append task',
                'Remove task',
                'Delete goal',
                'Cancel',
            ]
        }
    ])

    if (action === 'Edit goal'){
        console.clear()
        await editGoalView(selectedGoal)
        await viewGoals()
    }
    if (action === 'Append task'){
        console.clear()
        await selectTaskForAppendToGoal(selectedGoal)
        await viewGoals()
    }
    if (action === 'Remove task') {
        console.clear()
        await selectTaskForRemoveFromGoal(selectedGoal)
    }
    if (action === 'Delete goal') {
        console.log(selectedGoal.id)
        deleteGoalFromDb(selectedGoal.id)
        await viewGoals()
    }
    if (action === 'Cancel'){
        console.clear()
        await viewGoals()
    }
} 

const selectTaskForRemoveFromGoal = async (goal) => {
    const appendedTasks = getTasksForGoal(goal.id)
    const { taskForRemove } = await inquirer.prompt([
            {
                type: 'list',
                name: 'taskForRemove',
                message: 'Select task for remove',
                choices: appendedTasks.map(task => ({
                    name: task.task,
                    value: task
                }))
            }
        ])
        removeTaskGoalRelation(taskForRemove.id, goal.id)
}

const selectTaskForAppendToGoal = async (goal) => {
    const unlinkedTasks = getTasksWithoutGoal()
    const { taskForAppend } = await inquirer.prompt([
        {
            type: 'list',
            name: 'taskForAppend',
            message: 'Select task for appent to goal:',
            choices: unlinkedTasks.map(task => ({
                name: task.task,
                value: task
            }))
        }
    ])
    addTaskGoalRelation(taskForAppend.id, goal.id)
}

const editGoalView = async (goal) => {
    const { updatedGoal } = await inquirer.prompt([
        {
            type: 'input',
            name: 'updatedGoal',
            message: 'Edit the goal:',
            default: goal.goal, 
        },
    ])

    goal.goal = updatedGoal
    updatedGoalInDb(goal)
}

const addTask = async () => {
    const { task, description } = await inquirer.prompt([
        {
            type: 'input',
            name: 'task',
            message: 'Enter the task name'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Enter the task description (optional)'
        }
    ])

    addTaskToDb(task, description)
    console.clear()
    console.log(chalk.green(`Task added: "${task}"`));
};

const viewTasks = async () => {
    const allTasks = getAllTasksFromDb();

    if (allTasks.length === 0) {
        console.clear()
        console.log(chalk.red('You have no tasks'));
        return;
    }

    console.clear()
    console.log(chalk.yellow('All tasks:'));

    allTasks.forEach((taskObj, index) => {
        const {task, description, status} = taskObj
        const taskStatus = status === 'pending' ?  chalk.red('✗') : chalk.green('✓');
        const appendedGoal = getGoalForTask(taskObj.id)
        const goalLabel = appendedGoal.length >0 ? chalk.dim.white(`(${appendedGoal[0].goal})`) : ""
        
        console.log(chalk.blueBright.bold(`${index + 1}. ${taskStatus} ${task} ${goalLabel}`));
        if(description)
        console.log(`   ${chalk.white.dim(description)}`);
        
    })

    console.log()

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Select option:',
            choices: [
                'Mark a task as done',
                'Select task',
                'Go back to main menu',
            ],
        },
    ]);

    if (action === 'Mark a task as done') {
        await markTaskFromListAsDone(allTasks);
    }
    if (action === 'Select task') {
        await editTasksView(allTasks);
    }
    if (action === 'Go back to main menu') {
        console.clear()
        await mainMenu();
    }
};

const editTasksView = async (allTasks) => {
    console.clear()
    const { selectedTask } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedTask',
            message: 'Select task for edit:',
            choices: allTasks.map((task, index) => ({
                name: `${task.status === 'pending' ? chalk.red('✗') : chalk.green('✓')} ${chalk.blue(task.task)}`,
                value: task,
            }))
        }
    ])
    console.clear()
    console.log(`${chalk.yellow('Task detail:')}
    ${chalk.yellow('Task:')} ${selectedTask.task}
    ${chalk.yellow('Description:')} ${selectedTask.description}
    ${chalk.yellow('Status:')} ${selectedTask.status}`)

    console.log()

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Select option:',
            choices: [
                'Change status',
                'Edit task',
                'Delete task',
                'Cancel'
            ],
        },
    ]);

    if (action === 'Change status') {
        console.clear()
        console.log('Status was changed')
        const taskStatus = selectedTask.status === 'pending' ? 'done' : 'pending'
        changeTaskStatus(selectedTask.id, taskStatus);
        await viewTasks()
    }
    if (action === 'Edit task') {
        await editSelectedTask(selectedTask)
    }
    if (action === 'Delete task') {
        console.clear()
        console.log(chalk.green('Task was deleted'))
        deleteTaskFromDb(selectedTask.id)
    }
    if (action === 'Cancel') {
        console.clear()
    }
    
}

const markTaskFromListAsDone = async (allTasks) => {
    const { selectedTask } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedTask',
            message: 'Select a task to amrk as done',
            choices: allTasks.filter(task => task.status === 'pending')
            .map((task) => ({
                name: `${task.id}. ${task.task}`,
                value: task
            }))
        }
    ])
    
    changeTaskStatus(selectedTask.id, 'done')
    console.clear()
    console.log(chalk.green(`Task "${selectedTask.task}" was marked as done.`))
    await viewTasks() 
}

const editSelectedTask = async (task) => {
    console.clear()

    const { updatedTask, updatedDescription } = await inquirer.prompt([
    {
        type: 'input',
        name: 'updatedTask',
        message: 'Edit the task name:',
        default: task.task, 
    },
    {
        type: 'input',
        name: 'updatedDescription',
        message: 'Edit the description:',
        default: task.description || '',
    },
    ])

    task.task = updatedTask
    task.description = updatedDescription

    updateTaskInDb(task)
    console.clear()
    console.log(chalk.green(`Task was edited.`))
    await viewTasks()
}

mainMenu();
