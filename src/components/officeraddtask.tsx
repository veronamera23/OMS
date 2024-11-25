import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, addDoc, doc, getDoc } from "firebase/firestore";

interface OfficerAddTaskProps {
  close: () => void; // Prop to handle form closure
}

const OfficerAddTask: React.FC<OfficerAddTaskProps> = ({ close }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [assignedOfficer, setAssignedOfficer] = useState("");
  const [approvedMembers, setApprovedMembers] = useState<Array<{ uid: string; fullName: string }>>([]);

  // Fetch approved members from Firestore
  useEffect(() => {
    const fetchApprovedMembers = async () => {
      try {
        // Fetch members with status 'approved' from the 'Members' collection
        const membersQuery = query(collection(db, "Members"), where("status", "==", "approved"));
        const membersSnapshot = await getDocs(membersQuery);

        // For each approved member, fetch their fullName from the 'Users' collection
        const memberPromises = membersSnapshot.docs.map(async (memberDoc) => {
          const memberData = memberDoc.data();
          const userDoc = await getDoc(doc(db, "Users", memberData.uid));
          const fullName = userDoc.exists() ? userDoc.data()?.fullName || "Unknown Member" : "Unknown Member";

          return { uid: memberData.uid, fullName };
        });

        // Resolve all promises to get the list of approved members
        const resolvedMembers = await Promise.all(memberPromises);
        setApprovedMembers(resolvedMembers);
      } catch (error) {
        console.error("Error fetching approved members: ", error);
      }
    };

    fetchApprovedMembers();
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
      close(); // Close the form upon successful submission
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
                <option value="" disabled>
                  Select a member
                </option>
                {approvedMembers.length > 0 ? (
                  approvedMembers.map((member) => (
                    <option key={member.uid} value={member.uid}>
                      {member.fullName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No approved members found
                  </option>
                )}
              </select>
            </div>

            <button type="submit" className="submit-button">
              Add Task
            </button>
          </div>
        </form>

        {/* Close Button */}
        <button onClick={close} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default OfficerAddTask;
