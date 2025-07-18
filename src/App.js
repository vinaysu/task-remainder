
import React, { useState, useEffect } from 'react';
import './App.css';

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

const notify = (text) => {
  if (Notification.permission === 'granted') {
    new Notification('Task Reminder', { body: text });
  }
};

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [taskText, setTaskText] = useState('');
  const [remindTime, setRemindTime] = useState('');

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();
    const currentHour = String(now.getHours()).padStart(2, '0');
    const currentMinute = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;
    const today = now.toISOString().slice(0, 10); // YYYY-MM-DD

    tasks.forEach(task => {
      if (!task.completed && task.time === currentTime) {
        const reminderKey = `reminded_${task.id}_${today}_${currentTime}`;
        if (!sessionStorage.getItem(reminderKey)) {
          speak(task.text);
          notify(task.text);
          sessionStorage.setItem(reminderKey, 'true');
        }
      }
    });
  }, 1000); // Check every second

  return () => clearInterval(interval);
}, [tasks]);




  const addTask = () => {
    if (!taskText || !remindTime) return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      time: remindTime,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setTaskText('');
    setRemindTime('');
  };

  const markCompleted = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: true } : task));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const sortedTasks = [
    ...tasks.filter(t => !t.completed),
    ...tasks.filter(t => t.completed)
  ];

  return (
    <div className="app">
      <h1>Pending Tasks: {tasks.filter(task => !task.completed).length}</h1>
      <button onClick={() => speak('Testing voice notification')}>Test Voice</button>
      <div className="task-list">
        {sortedTasks.map(task => (
          <div className={`task ${task.completed ? 'completed' : ''}`} key={task.id}>
            <span>{task.text} - {task.time}</span>
            <div>
              {!task.completed && <button onClick={() => markCompleted(task.id)}>Complete</button>}
              <button onClick={() => removeTask(task.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="add-task-form">
        <input
          type="text"
          placeholder="Task description"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <input
          type="time"
          value={remindTime}
          onChange={(e) => setRemindTime(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <button className="floating-button" onClick={addTask}>+</button>
    </div>
  );
};

export default App;

