import React, { useEffect, useState } from "react";
import OfficerAddTask from "../components/officeraddtask"; // Import the OfficerAddTask component
import { auth, db } from "../firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const OfficerDashboard: React.FC = () => {
  const [isAddTaskOpen, setAddTaskOpen] = useState(false);
  const [organizationData, setOrganizationData] = useState<{
    organizationName: string;
    organizationLogo: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Open the add task form
  const handleAddTaskClick = () => {
    setAddTaskOpen(true);
  };

  // Close the add task form
  const handleCloseTaskForm = () => {
    setAddTaskOpen(false);
  };

  // Function to fetch organization data
  const fetchOrganizationData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "Users", userId));
      const userData = userDoc.data();

      // Ensure that user is part of an organization
      if (userData?.organizationId) {
        const orgDoc = await getDoc(doc(db, "Organizations", userData.organizationId));
        const orgData = orgDoc.data();

        if (orgData) {
          setOrganizationData({
            organizationName: orgData.name || "No Name",
            organizationLogo: orgData.photo || "/assets/OMSLOGO.png",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);
        fetchOrganizationData(user.uid); // Fetch organization data when the user logs in
      } else {
        setLoading(false); // Handle user being logged out
      }
    });

    const fetchTasks = async (organizationId: string) => {
      try {
        const tasksQuery = query(collection(db, "tasks"), where("organizationId", "==", organizationId));
        const taskSnapshot = await getDocs(tasksQuery);
        const taskList = taskSnapshot.docs.map(doc => doc.data());
        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array to run effect only once on mount

  if (loading) return <div>Loading...</div>; // Display loading state while fetching data

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-title">{ "OMS"}</div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-link">
            <span className="material-icons"></span>
            <span>Dashboard</span>
          </a>
          <a href="/acceptmember" className="nav-link">
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
            <h1 className="header-title">
              Welcome back, {organizationData?.organizationName || "Your Organization"}!
            </h1>
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
              <img
                src={organizationData?.organizationLogo || "/assets/default-logo.png"}
                alt="Organization Logo"
                className="org-logo-img"
              />
              <div>{organizationData?.organizationName}</div>
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
function setTasks(taskList: import("@firebase/firestore").DocumentData[]) {
  throw new Error("Function not implemented.");
}

