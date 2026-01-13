import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ title: "", description: "" });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const token = localStorage.getItem("token");

    const api = axios.create({
        baseURL: "http://localhost:5000/api/tasks",
        headers: { Authorization: `Bearer ${token}` }
    });

    const getAllTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get("/getall");
            setTasks(res.data);
        } catch {
            setError("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllTasks();
    }, []);

    const saveTask = async () => {
        if (!task.title || !task.description) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            if (editId) {
                await api.put(`/${editId}`, task);
                setEditId(null);
            } else {
                await api.post("/addtask", task);
            }

            setTask({ title: "", description: "" });
            getAllTasks();
        } catch {
            setError("Failed to save task");
        } finally {
            setLoading(false);
        }
    };

    const editTask = (t) => {
        setTask({ title: t.title, description: t.description });
        setEditId(t._id);
    };

    const deleteTask = async (id) => {
        try {
            setLoading(true);
            await api.delete(`/${id}`);
            getAllTasks();
        } catch {
            setError("Failed to delete task");
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks
        .filter(
            (t) =>
                t.title.toLowerCase().includes(search.toLowerCase()) ||
                t.description.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (filter === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
            if (filter === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            return 0;
        });

    return (
        <div className="task-app">
            <div className="top-bar">
                <h2 className="app-title">Your Task Dashboard</h2>
                <button
                    className="logout-btn"
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}
                >
                    Logout
                </button>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="task-layout">
                <div className="task-form-card">
                    <h4>{editId ? "Edit Task" : "Add New Task"}</h4>

                    <input
                        type="text"
                        placeholder="Task title"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                    />

                    <textarea
                        placeholder="Task description"
                        rows="4"
                        value={task.description}
                        onChange={(e) =>
                            setTask({ ...task, description: e.target.value })
                        }
                    />

                    <button onClick={saveTask} disabled={loading}>
                        {editId ? "Update Task" : "Add Task"}
                    </button>
                </div>

                <div className="task-list-card">
                    <h4>Your Tasks</h4>

                    <div className="d-flex gap-2 mb-3">
                        <input
                            className="form-control"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="rounded px-2"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="recent">Recent</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>

                    {loading && <p>Loading...</p>}

                    {!loading && filteredTasks.length === 0 && (
                        <p className="empty-text">No tasks found</p>
                    )}

                    {filteredTasks.map((t) => (
                        <div className="task-item" key={t._id}>
                            <div className="task-info">
                                <h6>{t.title}</h6>
                                <p>{t.description}</p>
                            </div>

                            <div className="task-actions">
                                <button className="edit-btn" onClick={() => editTask(t)}>
                                    ✏️
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteTask(t._id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
