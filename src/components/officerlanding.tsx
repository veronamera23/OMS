import React, { useState } from "react";
import OfficerAddTask from "../components/officeraddtask"; // Import the OfficerAddTask component

const OfficerDashboard: React.FC = () => {
  const [isAddTaskOpen, setAddTaskOpen] = useState(false);

  // Open the add task form
  const handleAddTaskClick = () => {
    setAddTaskOpen(true);
  };

  // Close the add task form
  const handleCloseTaskForm = () => {
    setAddTaskOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-title">OMS</div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-link">
            <span className="material-icons"></span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-link">
            <span className="material-icons"></span>
            <span>Members</span>
          </a>
          <a href="#" className="nav-link">
            <span className="material-icons"></span>
            <span>Events</span>
          </a>
          <a href="#" className="nav-link">
            <span className="material-icons"></span>
            <span>Calendar</span>
          </a>

          <hr className="officersidenav" />

          <a href="#" className="nav-link">
            <span className="material-icons"></span>
            <span>Information</span>
          </a>
          <a href="#" className="nav-link">
            <span className="material-icons"></span>
            <span>Profile Setting</span>
          </a>
        </nav>
        <div className="footer-info">footer information</div>
      </aside>

      {/* Main content */}
      <main className="main-content relative">
        {/* Header */}
        <header className="header">
          <div>
            <h1 className="header-title">Welcome back, UPV Komsai.Org!</h1>
            <p className="header-subtitle">What would you like to do?</p>
          </div>
          <button className="text-gray-600 hover:text-purple-700">
            <span className="material-icons">expand_more</span>
          </button>
        </header>

        {/* Officer Action Buttons */}
        <div className="action-buttons-container">
          <button className="officer-action-buttons" onClick={handleAddTaskClick}>
            Add Task
          </button>
          <button className="officer-action-buttons">Add Event</button>
          <button className="officer-action-buttons">View Orgs</button>
          <button className="officer-action-buttons">View Events</button>
        </div>

        {/* Add Task Form */}
        {isAddTaskOpen && <OfficerAddTask close={handleCloseTaskForm} />}

        {/* Organization Overview */}
        <div className="org-overview grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Column */}
          <div className="flex flex-col gap-4">
            <div className="org-logo-container">
              <img src="/assets/komsai.png" alt="Organization Logo" className="org-logo-img" />
              <div>upv.komsai.org</div>
            </div>

            <div className="pending-tasks">
              Pending Tasks
            </div>
          </div>

          {/* Rightmost Column */}
          <div className="relative flex flex-col gap-4">
            <div className="absolute top-0 right-0 w-1/3 flex flex-col gap-4">
              <div className="calendar mb-4">Calendar</div>

              <div className="memberstats">Statistics</div>
              <div className="eventstats">Statistics</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficerDashboard;
