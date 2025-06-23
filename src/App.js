// App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [remindTime, setRemindTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      tasks.forEach((task) => {
        if (!task.completed && task.time === currentTime) {
          speak(task.text);
        }
      });
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  const addTask = () => {
    if (!taskText || !remindTime) return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      time: remindTime,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskText("");
    setRemindTime("");
  };

  const markCompleted = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="app">
      <h1>Pending Tasks: {tasks.filter((task) => !task.completed).length}</h1>
      <div className="task-list">
        {tasks.map((task) => (
          <div
            className={`task ${task.completed ? "completed" : ""}`}
            key={task.id}
          >
            <span>
              {task.text} - {task.time}
            </span>
            <div>
              {!task.completed && (
                <button onClick={() => markCompleted(task.id)}>Complete</button>
              )}
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
      <button className="floating-button" onClick={addTask}>
        +
      </button>
    </div>
  );
};

export default App;
