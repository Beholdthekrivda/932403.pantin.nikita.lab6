'use strict';

function main()
{
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // 1. Функция для получения задач с сервера (GET)
    async function loadTasks() 
    {
        try 
        {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            
            taskList.innerHTML = ''; // Очищаем список

            if (tasks.length === 0) 
                {
                taskList.innerHTML = '<li>Задач пока нет. Добавьте первую!</li>';
                return;
            }

            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.title;
                if (task.completed) li.classList.add('completed');
                taskList.appendChild(li);
            });
        } 
        catch (error) 
        {
            console.error('Ошибка при загрузке задач:', error);
            taskList.innerHTML = '<li>Ошибка загрузки данных</li>';
        }
    }

    // 2. Обработчик отправки формы (POST)
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        
        const title = taskInput.value.trim();
        if (!title) return;

        try 
        {
            const response = await fetch('/api/tasks', 
                {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title })
            });

            if (response.ok) 
                {
                taskInput.value = ''; // Очищаем поле
                loadTasks(); // Перезапрашиваем список, чтобы обновить экран
            } 
            else 
                {
                alert('Ошибка при добавлении задачи (возможно, пустой title)');
            }
        } 
        catch (error) 
        {
            console.error('Ошибка:', error);
        }
    });

    // Загружаем задачи при открытии страницы
    loadTasks();

    if ('serviceWorker' in navigator) 
        {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker зарегистрирован!', registration.scope);
                })
                .catch(err => {
                    console.error('Ошибка регистрации Service Worker:', err);
                });
        });
    }
}

main();