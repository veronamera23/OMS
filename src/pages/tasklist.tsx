import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<
    Array<{
      id: string;
      taskName: string;
      description: string;
      dueDate: string;
      priority: string;
      assignedOfficer: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskCollection = collection(db, "tasks");
        const taskSnapshot = await getDocs(taskCollection);

        const taskList = taskSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Array<{
          id: string;
          taskName: string;
          description: string;
          dueDate: string;
          priority: string;
          assignedOfficer: string;
        }>;

        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4" style={{ color: "#333399" }}>
        Task List
      </h2>
      {tasks.length > 0 ? (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="p-4 bg-white rounded-md shadow-md"
              style={{ borderLeft: "4px solid #8736EA" }}
            >
              <h3 className="text-lg font-semibold">{task.taskName}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-sm">
                <strong>Due Date:</strong> {new Date(task.dueDate).toDateString()}
              </p>
              <p className="text-sm">
                <strong>Priority:</strong> {task.priority}
              </p>
              <p className="text-sm">
                <strong>Assigned Officer:</strong> {task.assignedOfficer}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
};

export default TaskList;
