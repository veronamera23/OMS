import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const MemTaskList: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks directly based on the logged-in user's memberId
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Start loading
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          // Fetch tasks directly using the user's UID as memberId
          const tasksQuery = query(
            collection(db, "tasks"),
            where("memberId", "==", user.uid) // Assuming user.uid is used as memberId
          );
          const tasksSnapshot = await getDocs(tasksQuery);
          const memtaskList = tasksSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(memtaskList);
        } catch (error) {
          console.error("Error fetching tasks: ", error);
        }
      }
      setLoading(false); // Finish loading
    };

    fetchTasks();
  }, []); // Runs once when the component mounts

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="task-list-container">
      <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: "#333399" }}>
        Assigned Tasks
      </h2>

      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-details">
                <h3>{task.taskName}</h3>
                <p>{task.description}</p>
                <p>Due Date: {task.dueDate?.toDate().toLocaleDateString()}</p>
                <p>Priority: {task.priority}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemTaskList;
