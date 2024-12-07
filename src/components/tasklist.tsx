import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface Task {
  id: string;
  taskName: string;
  description: string;
  dueDate: string;
  priority: string;
  assignedOfficer: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setError("You must be logged in to view tasks.");
          setLoading(false);
          return;
        }

        // Fetch user document to get organizationId
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          setError("User not found.");
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        const organizationId = userData?.organizationId;

        if (!organizationId) {
          setError("Organization ID not found for the user.");
          setLoading(false);
          return;
        }

        // Fetch tasks belonging to the organization
        const tasksRef = collection(db, "tasks");
        const tasksQuery = query(tasksRef, where("organizationId", "==", organizationId));
        const tasksSnapshot = await getDocs(tasksQuery);

        const taskList = tasksSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            taskName: data.taskName,
            description: data.description,
            dueDate: new Date(data.dueDate.seconds * 1000).toLocaleString(),
            priority: data.priority,
            assignedOfficer: data.assignedOfficer,
          } as Task;
        });

        setTasks(taskList);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError("Error fetching tasks: " + errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, []);

  return (
    <div>
      {loading && <p>Loading tasks...</p>}
      {error && <p>{error}</p>}
      {!loading && tasks.length === 0 && <p>No tasks available.</p>}
      {!loading &&
        tasks.map((task) => (
          <div key={task.id}>
            <h3>{task.taskName}</h3>
            <p>{task.description}</p>
            <p>{task.dueDate}</p>
            <p>{task.priority}</p>
            <p>{task.assignedOfficer}</p>
          </div>
        ))}
    </div>
  );
};

export default TaskList;
