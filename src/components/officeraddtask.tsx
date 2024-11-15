import React, { useState } from "react";

interface OfficerAddTaskProps {
  close: () => void; //passing prop para indi mag hook error
}

const OfficerAddTask: React.FC<OfficerAddTaskProps> = ({ close }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [assignedOfficer, setAssignedOfficer] = useState("");

  //if real officers na siya need ta ni ichange to a function
  //na would fetch officer names from the database the be presented as
  //dropdown list dayon
  const officers = [
    "Officer 1",
    "Officer 2",
    "Officer 3",
    "Officer 4"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ taskName, description, dueDate, priority, assignedOfficer });
    alert("Task added successfully!");
    close(); //close form pagclick snag user submit
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
                {officers.map((officer, index) => (
                  <option key={index} value={officer}>
                    {officer}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-button">
              Add Task
            </button>
          </div>
        </form>

        {/*Close Button*/}
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
