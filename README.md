# life-planner-cli
#### Video Demo:  <URL HERE>
#### Description:
Life Planner CLI is a command-line tool designed for efficient task and goal management. It allows users to add, view, and edit tasks and goals, as well as assign tasks to specific goals. The tool provides a simple and intuitive interface using libraries like `inquirer` and `chalk` for interactivity and styled output.

The application's goal is to offer a minimalist planning solution for users who want to stay organized with their tasks and goals without relying on complex graphical tools.

---

#### Key Features:
1. **Goal Management**:
   - Add new goals with a simple input.
   - View a list of all defined goals in a clear format.
   - Edit existing goals, such as updating their title.
   - Delete goals that are no longer relevant.
   - View tasks linked to each goal with a clear indication of their status (completed/incomplete).

2. **Task Management**:
   - View a list of all tasks with the ability to mark their status.
   - Add new tasks with optional detailed descriptions.
   - Update tasks, such as modifying their name, description, or status.
   - Delete tasks that are no longer needed.
   - Quickly mark tasks as completed directly from the list.

3. **Task-Goal Linking**:
   - Assign tasks to specific goals, providing an overview of what needs to be done to achieve a goal.
   - Remove tasks from specific goals.

---

#### File Structure:
- **`index.js`**: The main application file containing all CLI logic.
- **`db/tasks.js`**: Manages task-related operations such as adding, updating, changing status, and deleting tasks in the database.
- **`db/goals.js`**: Manages goal-related operations, including adding, editing, and deleting goals.
- **`db/taskGoalRelations.js`**: Handles relationships between tasks and goals, including assigning tasks to specific goals or removing them.

#### Database Structure:
The application uses an SQLite database via the `better-sqlite3` library. This database contains the following tables:

1. **`goals`**:
   - Stores goals.
   - Structure:
     - `id`: Primary key (INTEGER, AUTO_INCREMENT).
     - `goal`: Text value describing the goal.

2. **`tasks`**:
   - Stores tasks.
   - Structure:
     - `id`: Primary key (INTEGER, AUTO_INCREMENT).
     - `task`: Task name.
     - `description`: Optional description of the task.
     - `status`: Task status (`pending` or `done`).

3. **`task_goal_relations`**:
   - Represents relationships between tasks and goals.
   - Structure:
     - `task_id`: Task ID (foreign key).
     - `goal_id`: Goal ID (foreign key).

---

#### Used Technologies:
- **Node.js**: For backend application logic.
- **Inquirer**: A library for interactive user prompts in the command line.
- **Chalk**: Used for styling output in the terminal.
- **better-sqlite3**: A library for managing SQLite databases to handle tasks, goals, and their relationships.

---

#### Design Decisions:
During development, the following design choices were made:
- **Modularity**: Database operations are split into separate modules (`tasks.js`, `goals.js`, `taskGoalRelations.js`), enhancing code readability and maintainability.
- **Relationships**: Linking tasks with specific goals allows users to organize their work more effectively.
- **Simplicity**: The interface was kept simple and intuitive using interactive menus.
- **Clarity**: Outputs are styled to be user-friendly and visually appealing.
- **Logic Enhancements**:
  - When a goal has no tasks, the option to remove tasks is hidden.
  - When assigning a task to a goal, only tasks without existing assignments are displayed.

---

#### Future Extensions:
- Goal archiving functionality.
- Displaying percentage completion of goals based on linked tasks.
- Filters to show only completed or incomplete tasks.
- Displaying global statistics.
- Data export options.

---

#### How to Run the Application:
1. Clone this repository: 
   ```bash
   git clone https://github.com/avaricz/life-planner-cli.git
   ```

2. Navigate to the project directory:
   ```bash
   cd life-planner-cli
   ```
3. Install dependencies: 
    ```bash
    npm instal
    ```
4. Run the application:   
    ```bash
    node index.js
    ```