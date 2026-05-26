import { useEffect, useState } from "react";

import API from "../services/api";

function Dashboard() {

  const [tasks, setTasks] = useState([]);

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

  useEffect(() => {

    fetchTasks();

  }, []);

  return (
    <div>

      <h1>Dashboard</h1>

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
                padding: "10px",
                marginBottom: "10px",
              }}
            >

              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <p>
                Priority: {task.priority}
              </p>

              <p>
                Completed:
                {task.completed ? " Yes" : " No"}
              </p>

            </div>
          ))
        )
      }

    </div>
  );
}

export default Dashboard;