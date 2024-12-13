import inquirer from 'inquirer';
import chalk from 'chalk';
import { addTaskToDb,  } from './db.js';

const mainMenu = async () => {
    console.log(chalk.blue.bold('Welcome to Life Planner CLI!'));

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

    // Loop back to the menu
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
    // Zde byste mohli uložit úkol do souboru nebo databáze
};

const viewTasks = async () => {
    console.log(chalk.yellow('Here are your tasks:'));
    // Zde načtěte a zobrazte uložené úkoly (z pole, souboru nebo databáze)
};

// Spuštění programu
mainMenu();
