'use strict';

const tasks = [];

function main() 
{
    const express = require('express');
    const path = require('path');
    const app = express();
    const PORT = 3000;

    app.use(express.json());
    app.use(express.static('public'));

    app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'index.html'));});
    app.get('/about', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'about.html'));});
    app.get('/api/status', (req, res) => {res.json({ status: 'ok', message: 'Сервер работает!' });});
    app.get('/api/tasks', (req, res) => 
    {
        const completedQuery = req.query.completed;

        if (completedQuery == 'true')
        {
            const filteredTasks = tasks.filter(task => task.completed == true);
            return res.json(filteredTasks);
        }

        res.json(tasks);
    });
    app.post('/api/tasks', (req, res) => 
    {
        const { title } = req.body;

        if (!title)
        {
            return res.status(400).json({error: 'Поле title не заполнено'});
        }

        const newTask =
        {
            id: Date.now(),
            title: title,
            completed: false
        };

        tasks.push(newTask);
        res.status(201).json(newTask);
    });

    app.listen(PORT, () => 
    {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });

    console.log('Привет из Node.js!');
}

main();
