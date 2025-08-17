<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List App</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        /* General Styling */
        :root {
            --primary-color: #4a90e2;
            --background-color: #f4f7f9;
            --container-bg: #ffffff;
            --text-color: #333;
            --completed-text-color: #999;
            --border-color: #ddd;
            --shadow-color: rgba(0, 0, 0, 0.1);
            --danger-color: #e74c3c;
            --danger-hover-color: #c0392b;
            --edit-color: #3498db;
            --edit-hover-color: #2980b9;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            padding: 20px;
        }

        /* Main App Container */
        .container {
            width: 100%;
            max-width: 600px;
            background: var(--container-bg);
            border-radius: 12px;
            box-shadow: 0 8px 25px var(--shadow-color);
            padding: 30px;
            margin-top: 20px;
        }

        header {
            text-align: center;
            margin-bottom: 25px;
        }

        header h1 {
            color: var(--primary-color);
            font-weight: 600;
        }

        /* Input Form */
        .input-section {
            display: flex;
            gap: 10px;
            margin-bottom: 25px;
        }

        #task-input {
            flex-grow: 1;
            padding: 12px 15px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s;
        }

        #task-input:focus {
            border-color: var(--primary-color);
        }

        #add-task-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 0 25px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        #add-task-btn:hover {
            background-color: #357abd;
        }
        
        /* Task List */
        #task-list {
            list-style: none;
        }

        .task-item {
            display: flex;
            align-items: center;
            padding: 15px 10px;
            border-bottom: 1px solid var(--border-color);
            transition: background-color 0.2s;
        }
        
        .task-item:last-child {
            border-bottom: none;
        }

        .task-item:hover {
            background-color: #f9f9f9;
        }

        .task-item.completed .task-text {
            text-decoration: line-through;
            color: var(--completed-text-color);
        }

        .task-item input[type="checkbox"] {
            margin-right: 15px;
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .task-text {
            flex-grow: 1;
            font-size: 1rem;
            cursor: pointer;
        }

        .task-actions button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
            margin-left: 10px;
            font-size: 1.1rem;
            transition: color 0.3s;
        }

        .edit-btn {
            color: var(--edit-color);
        }
        .edit-btn:hover {
            color: var(--edit-hover-color);
        }
.delete-btn {
            color: var(--danger-color);
        }
        .delete-btn:hover {
            color: var(--danger-hover-color);
        }

        /* Responsive Design */
        @media (max-width: 480px) {
            .container {
                padding: 20px;
            }
            .input-section {
                flex-direction: column;
            }
            #add-task-btn {
                padding: 12px;
            }
        }
    </style>
</head>
<body>

    <div class="container">
        <header>
            <h1>My To-Do List</h1>
        </header>
        <section class="input-section">
            <input type="text" id="task-input" placeholder="Add a new task...">
            <button id="add-task-btn">Add Task</button>
        </section>
        <section class="task-list-section">
            <ul id="task-list">
                <!-- Tasks will be dynamically added here -->
            </ul>
        </section>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // DOM Elements
            const taskInput = document.getElementById('task-input');
            const addTaskBtn = document.getElementById('add-task-btn');
            const taskList = document.getElementById('task-list');

            // Load tasks from local storage on page load
            loadTasks();

            /**
             * Adds a new task when the button is clicked or Enter is pressed.
             */
            function addTask() {
                const taskText = taskInput.value.trim();

                // Validation: Do not add empty tasks
                if (taskText === '') {
                    alert('Please enter a task.');
                    return;
                }

                createTaskElement(taskText, false);
                taskInput.value = '';
                saveTasks();
            }
            
            /**
             * Creates and appends a new task item to the DOM.
             * @param {string} text - The text content of the task.
             * @param {boolean} isCompleted - The completion status of the task.
             */
            function createTaskElement(text, isCompleted) {
                const li = document.createElement('li');
                li.className = 'task-item';
                if (isCompleted) {
                    li.classList.add('completed');
                }

                li.innerHTML = 
                    <input type="checkbox" ${isCompleted ? 'checked' : ''}>
                    <span class="task-text">${text}</span>
                    <div class="task-actions">
                        <button class="edit-btn">✏️</button>
                        <button class="delete-btn">🗑️</button>
                    </div>
                ;
                
                taskList.appendChild(li);
            }

            /**
             * Handles clicks on the task list for various actions.
             * @param {Event} e - The click event object.
             */
            function handleTaskClick(e) {
                const target = e.target;
                const taskItem = target.closest('.task-item');
                
                if (!taskItem) return;

                // Toggle task completion
                if (target.type === 'checkbox') {
                    taskItem.classList.toggle('completed');
                }

                // Delete task
                if (target.classList.contains('delete-btn')) {
                    taskItem.remove();
                }

                // Edit task
                if (target.classList.contains('edit-btn')) {
                    editTask(taskItem);
                }
                
                saveTasks();
            }
            
            /**
             * Enables editing of a task's text.
* @param {HTMLElement} taskItem - The list item element of the task.
             */
            function editTask(taskItem) {
                const taskTextSpan = taskItem.querySelector('.task-text');
                const currentText = taskTextSpan.textContent;
                
                const newText = prompt('Edit your task:', currentText);

                if (newText !== null && newText.trim() !== '') {
                    taskTextSpan.textContent = newText.trim();
                    saveTasks();
                } else if (newText !== null) {
                    alert('Task cannot be empty.');
                }
            }

            /**
             * Saves all current tasks to local storage.
             */
            function saveTasks() {
                const tasks = [];
                document.querySelectorAll('.task-item').forEach(taskItem => {
                    tasks.push({
                        text: taskItem.querySelector('.task-text').textContent,
                        completed: taskItem.classList.contains('completed')
                    });
                });
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            /**
             * Loads tasks from local storage and displays them.
             */
            function loadTasks() {
                const tasks = JSON.parse(localStorage.getItem('tasks'));
                if (tasks) {
                    tasks.forEach(task => createTaskElement(task.text, task.completed));
                }
            }

            // Event Listeners
            addTaskBtn.addEventListener('click', addTask);
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addTask();
                }
            });
            taskList.addEventListener('click', handleTaskClick);
        });
    </script>

</body>
</html>