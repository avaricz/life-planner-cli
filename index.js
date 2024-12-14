import inquirer from 'inquirer';
import chalk from 'chalk';
import { addTaskToDb, getAllTasksFromDb } from './db.js';

const mainMenu = async () => {
    console.log(chalk.blue.bold('Welcome to Life Planner CLI!'));
    console.log()

    const choices = [
        'Add a new task',
        'View tasks',
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
        case 'Add a new task':
            await addTask();
            break;
        case 'View tasks':
            await viewTasks();
            break;
        case 'Exit':
            console.log(chalk.green('Goodbye!'));
            process.exit(0);
    }

    await mainMenu();
};

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

    console.log(chalk.green(`Task added: "${task}"`));
};

const viewTasks = async () => {
    const allTasks = getAllTasksFromDb();

    if (allTasks.length === 0) {
        console.log(chalk.red('You have no tasks'));
        return;
    }

    console.log()
    console.log(chalk.yellow('Here are your tasks:'));


    allTasks.forEach((obj, index) => {
        const {task, description, status} = obj
        const taskStatus = status === 'pending' ?  chalk.red('✗ Pending') : chalk.green('✓ Done');
        
        
        console.log(chalk.blueBright.bold(`${index + 1}. ${task}   ${taskStatus}`));
        if (description) {
            console.log(`   ${chalk.dim(description)}`);
        }
        console.log(); 
    })

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Would you like to:',
            choices: [
                'Mark a task as done',
                'Go back to main menu',
            ],
        },
    ]);

    if (action === 'Mark a task as done') {
        await markTaskAsDone(allTasks);
    }
    if (action === 'Go back to main menu') {
        await mainMenu();
    }
};

const markTaskAsDone = async (allTasks) => {
    const { taskIndex } = await inquirer.prompt([
        {
            type: 'list',
            name: 'taskIndex',
            message: 'Select a task to amrk as done',
            choices: allTasks.map((task, index) => ({
                name: task.task,
                value: index,
            }))
        }
    ])

    allTasks[taskIndex].status = 'done'
    console.log(chalk.green(`Task ${allTasks[taskIndex].task} was marked as done.`))
}

mainMenu();
