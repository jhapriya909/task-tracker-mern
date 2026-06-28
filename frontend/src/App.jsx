import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addOrUpdateTask = async () => {
    if (taskInput.trim() === "") {
      alert("Please enter a task");
      return;
    }

    if (editId) {
      await axios.put(`${API}/${editId}`, { text: taskInput });
      setEditId(null);
    } else {
      await axios.post(API, { text: taskInput });
    }

    setTaskInput("");
    fetchTasks();
  };

  const editTask = (task) => {
    setTaskInput(task.text);
    setEditId(task._id);
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await axios.put(`${API}/${task._id}`, {
      completed: !task.completed,
    });
    fetchTasks();
  };

  const clearAll = async () => {
    for (let task of tasks) {
      await axios.delete(`${API}/${task._id}`);
    }
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    const searchMatch = task.text.toLowerCase().includes(search.toLowerCase());
    if (filter === "active") return !task.completed && searchMatch;
    if (filter === "completed") return task.completed && searchMatch;
    return searchMatch;
  });

  const completed = tasks.filter((task) => task.completed).length;
  const active = tasks.length - completed;
  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">☑ Task <span>Tracker</span></div>

        <button className="side-btn active" onClick={() => setFilter("all")}>⌂ Home</button>
        <button className="side-btn" onClick={() => setFilter("active")}>▣ Today</button>
        <button className="side-btn" onClick={() => setFilter("completed")}>✓ Completed</button>

        <div className="line"></div>

        <h3 className="stats-title">Statistics</h3>

        <div className="stat-card">
          <div className="stat-icon">☷</div>
          <div><p>All Tasks</p><b>{tasks.length}</b></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">○</div>
          <div><p>Active</p><b>{active}</b></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">✓</div>
          <div><p>Completed</p><b>{completed}</b></div>
        </div>

        <div className="illustration">📋</div>
      </aside>

      <main className="main-area">
        <div className="top">
          <div className="title-box">
            <div className="title-icon">▣</div>
            <div>
              <h1>Task Tracker</h1>
              <p>Organize your daily tasks efficiently</p>
            </div>
          </div>

          <div className="search-area">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="signin">♙ Sign in</button>
          </div>
        </div>

        <section className="task-panel">
          <div className="input-row">
            <input
              type="text"
              placeholder="Enter a task..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addOrUpdateTask()}
            />
            <button className="add-btn" onClick={addOrUpdateTask}>
              {editId ? "Update Task" : "Add Task"} ＋
            </button>
            <button className="clear-btn" onClick={clearAll}>🗑 Clear All</button>
          </div>

          <div className="filters">
            <button className={filter === "all" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("all")}>All</button>
            <button className={filter === "active" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("active")}>Active</button>
            <button className={filter === "completed" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("completed")}>Completed</button>
          </div>

          <ul className="task-list">
            {filteredTasks.length === 0 ? (
              <p className="empty">No tasks found</p>
            ) : (
              filteredTasks.map((task) => (
                <li key={task._id} className="task-item">
                  <span
                    className={task.completed ? "circle done" : "circle"}
                    onClick={() => toggleComplete(task)}
                  >
                    {task.completed ? "✓" : ""}
                  </span>

                  <span className={task.completed ? "task-text completed-text" : "task-text"}>
                    {task.text}
                  </span>

                  <button className="edit-btn" onClick={() => editTask(task)}>✎</button>
                  <button className="delete-btn" onClick={() => deleteTask(task._id)}>🗑</button>
                </li>
              ))
            )}
          </ul>

          <div className="bottom">
            <span>☷</span>
            <span>{completed} of {tasks.length} tasks completed</span>
            <div className="progress"><div style={{ width: `${percent}%` }}></div></div>
            <span>{percent}%</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;