import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Assuming you have firebaseConfig file
import { collection, getDocs, addDoc } from "firebase/firestore";

interface OfficerAddTaskProps {
  close: () => void; // passing prop para indi mag hook error
}

const OfficerAddTask: React.FC<OfficerAddTaskProps> = ({ close }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [assignedOfficer, setAssignedOfficer] = useState("");
  const [officers, setOfficers] = useState<string[]>([]); // state for officer names

  // Fetch officers from Firestore
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const officersCollection = collection(db, "officers"); // Assuming your officers are stored in an 'officers' collection
        const officersSnapshot = await getDocs(officersCollection);
        const officerList = officersSnapshot.docs.map(doc => doc.data().name); // assuming each officer document has a 'name' field
        setOfficers(officerList);
      } catch (error) {
        console.error("Error fetching officers: ", error);
      }
    };

    fetchOfficers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Add the task to Firestore
      await addDoc(collection(db, "tasks"), {
        taskName,
        description,
        dueDate: new Date(dueDate),
        priority,
        assignedOfficer,
      });
      console.log("Task added successfully!");
      alert("Task added successfully!");
      close(); // close form upon successful submission
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  return (
    <div className="add-modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="form-label">Task Name</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                required
              />
            </div>

            <div>
              <label className="form-label">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="form-label">Assign Officer</label>
              <select
                value={assignedOfficer}
                onChange={(e) => setAssignedOfficer(e.target.value)}
                className="form-select"
                required
              >
                <option value="" disabled>Select an officer</option>
                {officers.length > 0 ? (
                  officers.map((officer, index) => (
                    <option key={index} value={officer}>
                      {officer}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Loading officers...</option>
                )}
              </select>
            </div>

            <button type="submit" className="submit-button">
              Add Task
            </button>
          </div>
        </form>

        {/* Close Button */}
        <button
          onClick={close}
          className="close-button"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OfficerAddTask;
