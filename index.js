import inquirer from 'inquirer';
import chalk from 'chalk';
import { addTaskToDb, getAllTasksFromDb, changeTaskStatus, deleteTaskFromDb, updateTaskInDb } from './db.js';

const mainMenu = async () => {
    console.log(chalk.blue.bold('Life Planner CLI!'));
    console.log()

    const choices = [
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
        const taskStatus = status === 'pending' ?  chalk.red('✗ Pending') : chalk.green('✓ Done');
        
        
        console.log(chalk.blueBright.bold(`${index + 1}. ${task}   ${taskStatus}`));
        if (description) {
            console.log(`   ${chalk.dim(description)}`);
        } 
    })

    console.log()

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Select option:',
            choices: [
                'Mark a task as done',
                'Edit tasks',
                'Go back to main menu',
            ],
        },
    ]);

    if (action === 'Mark a task as done') {
        await markTaskFromListAsDone(allTasks);
    }
    if (action === 'Edit tasks') {
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
                name: `${task.task} ${task.status === 'pending' ? chalk.red('✗') : chalk.green('✓')}`,
                value: task,
            }))
        }
    ])
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
                name: `index: ${task.id}, name:${task.task}`,
                value: task
            }))
        }
    ])
    
    changeTaskStatus(selectedTask.id, 'done')
    console.clear()
    console.log(chalk.green(`Task "${selectedTask.task}" was marked as done.`)) 
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
}

mainMenu();
