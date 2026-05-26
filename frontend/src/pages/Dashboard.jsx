import { useEffect, useState } from "react";

import API from "../services/api";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "LOW",
    due_date: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchTasks = async () => {

    try {

      const response = await API.get(
        "/tasks/list/"
      );

      setTasks(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch tasks");
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/tasks/",
        formData
      );

      alert("Task Created Successfully");

      setFormData({
        title: "",
        description: "",
        priority: "LOW",
        due_date: "",
      });

      fetchTasks();

    } catch (error) {

      console.log(error);

      alert("Failed to create task");
    }
  };

  const handleDelete = async (id) => {

    try {

      await API.delete(
        `/tasks/delete/${id}/`
      );

      alert("Task Deleted");

      fetchTasks();

    } catch (error) {

      console.log(error);

      alert("Failed to delete task");
    }
  };

  const handleComplete = async (task) => {

    try {

      await API.put(
        `/tasks/${task.id}/`,
        {
          completed: !task.completed,
        }
      );

      fetchTasks();

    } catch (error) {

      console.log(error);

      alert("Failed to update task");
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      due_date: task.due_date,
    });
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(
        `/tasks/${id}/`,
        editData
      );

      alert("Task Updated Successfully");
      setEditingId(null);
      setEditData({});
      fetchTasks();
    } catch (error) {
      console.log(error);
      alert("Failed to update task");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  useEffect(() => {

    fetchTasks();

  }, []);

  return (
    <div style={{ padding: "20px" }}>

      <h1>Task Dashboard</h1>

      <hr />

      <h2>Create Task</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
        />

        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >

          <option value="LOW">
            Low
          </option>

          <option value="MEDIUM">
            Medium
          </option>

          <option value="HIGH">
            High
          </option>

        </select>

        <br /><br />

        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Create Task
        </button>

      </form>

      <hr />

      <h2>Your Tasks</h2>

      {
        tasks.length === 0 ? (

          <p>No Tasks Found</p>

        ) : (

          tasks.map((task) => (

            <div
              key={task.id}
              style={{
                border: "1px solid black",
                padding: "15px",
                marginBottom: "15px",
              }}
            >
              {editingId === task.id ? (
                <div>
                  <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={editData.title}
                    onChange={handleEditChange}
                    style={{ width: "100%", marginBottom: "10px" }}
                  />

                  <textarea
                    name="description"
                    placeholder="Description"
                    value={editData.description}
                    onChange={handleEditChange}
                    style={{ width: "100%", marginBottom: "10px" }}
                  />

                  <select
                    name="priority"
                    value={editData.priority}
                    onChange={handleEditChange}
                    style={{ marginRight: "10px", marginBottom: "10px" }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>

                  <input
                    type="date"
                    name="due_date"
                    value={editData.due_date}
                    onChange={handleEditChange}
                    style={{ marginRight: "10px", marginBottom: "10px" }}
                  />

                  <br />

                  <button
                    onClick={() => handleUpdate(task.id)}
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </button>

                  <button
                    onClick={cancelEdit}
                    style={{ backgroundColor: "#ccc" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <h3>{task.title}</h3>

                  <p>{task.description}</p>

                  <p>
                    Priority: {task.priority}
                  </p>

                  <p>
                    Due Date: {task.due_date}
                  </p>

                  <p>
                    Completed:
                    {task.completed ? " Yes" : " No"}
                  </p>

                  <button
                    onClick={() => handleComplete(task)}
                  >
                    {
                      task.completed
                        ? "Mark Pending"
                        : "Mark Completed"
                    }
                  </button>

                  <button
                    onClick={() => startEdit(task)}
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}

            </div>
          ))
        )
      }

    </div>
  );
}

export default Dashboard;