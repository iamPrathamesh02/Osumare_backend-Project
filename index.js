const express = require('express');
const bParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bParser.json());

let mainTasks = [];
let nextId = 1;

// Validation function
const validateTask = (task) => {
    if (!task.title || !task.description) {
        return false;
    }
    return true;
};

// Get all mainTasks
app.get('/tasks', (req, res) => {
    res.status(200).json(mainTasks);
});

// Get a specific task by ID
app.get('/tasks/:id', (req, res) => {
    const task = mainTasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
});

// Create a new task
app.post('/tasks', (req, res) => {
    const task = req.body;
    if (!validateTask(task)) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    task.id = nextId++;
    mainTasks.push(task);
    res.status(201).json(task);
});

// Update an existing task by ID
app.put('/tasks/:id', (req, res) => {
    const task = mainTasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const new_update_Task = req.body;
    if (!validateTask(new_update_Task)) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    task.title = new_update_Task.title;
    task.description = new_update_Task.description;
    res.status(200).json(task);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = mainTasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    mainTasks.splice(taskIndex, 1);
    res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Task Manager API is running at http://localhost:${port}`);
});