import React, { useEffect, useState } from "react";
import OfficerAddTask from "../components/officeraddtask"; // Import the OfficerAddTask component
import OfficerAddEvent from "./officeraddevent";
import OfficerSidebar from "./officersidebar";
import { auth, db } from "../firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
//import OfficerTasksListPage from "../pages/officertaskspage";
import Link from 'next/link';
import TaskList from './tasklist';

const OfficerDashboard: React.FC = () => {
  const [isAddTaskOpen, setAddTaskOpen] = useState(false);
  const [isAddEventOpen, setAddEventOpen] = useState(false);
  const [organizationData, setOrganizationData] = useState<{
    organizationName: string;
    organizationLogo: string;
    organizationDescription: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvedMemberCount, setApprovedMemberCount] = useState<number>(0);
  const [completedEventCount, setCompletedEventCount] = useState<number>(0);

  // Open/close the add task form
  const handleAddTaskClick = () => setAddTaskOpen(true);
  const handleCloseTaskForm = () => setAddTaskOpen(false);

  // Open/close the event task form
  const handleAddEventClick = () => setAddEventOpen(true);
  const handleCloseEventForm = () => setAddEventOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
    }
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
            organizationDescription: orgData.description || "No description available.",
          });

          // Fetch approved members for this organization
          fetchApprovedMembers(userData.organizationId);
          fetchCompletedEvents(userData.organizationId)
        }
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch approved members count
  const fetchApprovedMembers = async (organizationId: string) => {
    try {
      const membersQuery = query(
        collection(db, "Members"),
        where("organizationId", "==", organizationId),
        where("status", "==", "approved")
      );
      const memberSnapshot = await getDocs(membersQuery);
      setApprovedMemberCount(memberSnapshot.size); // Set the count
    } catch (error) {
      console.error("Error fetching approved members:", error);
    }
  };

  const fetchCompletedEvents = async (organizationId: string) => {
    try {
      const eventsQuery = query(
        collection(db, "events"),
        where("organizationId", "==", organizationId),
        where("status", "==", "Upcoming") // Assuming the status for completed events is 'completed'
      );
      const eventSnapshot = await getDocs(eventsQuery);
      setCompletedEventCount(eventSnapshot.size); // Set the count after fetching the events
    } catch (error) {
      console.error("Error fetching completed events:", error);
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

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array to run effect only once on mount

  if (loading) return <div>Loading...</div>; // Display loading state while fetching data

  return (
    <div className="flex">
      {/* Sidebar */}
      <OfficerSidebar />
      {/* Main content */}
      <main className="main-content flex-grow p-6 relative">
        <header className="header mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {organizationData?.organizationName || "Your Organization"}!
            </h1>
            <p className="text-gray-600">What would you like to do?</p>
          </div>
          <button
            className="logout-button text-sm px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 absolute right-[1.5rem] top-[2rem]"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </header>

        {/* Officer Action Buttons */}
        <div className="flex gap-4 mb-6 w-full">
          <button className="officer-action-buttons flex-grow" onClick={handleAddTaskClick}>
            Add Task
          </button>
          <button className="officer-action-buttons flex-grow" onClick={handleAddEventClick}>
            Add Event
          </button>
          <Link href="/#">
          <button className="officer-action-buttons flex-grow">View Officers</button>
          </Link>
          <Link href="/userevents">
             <button className="officer-action-buttons flex-grow">View My Events</button>
          </Link>
         
        </div>

        {/* Add Task Form */}
        {isAddTaskOpen && <OfficerAddTask close={handleCloseTaskForm} />}

        {/* Add Event Form */}
        {isAddEventOpen && <OfficerAddEvent close={handleCloseEventForm} />}

        {/* Organization Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="org-overview flex flex-col gap-4">
            <div className="org-logo-container flex items-center gap-6">
              <img
                src={organizationData?.organizationLogo || "/assets/default-logo.png"}
                alt="Organization Logo"
                className="org-logo-img w-24 h-24 rounded-full object-cover shadow"
              />
            </div>

            <div className="absolute left ml-52">
              <h2 className="text-xl font-semibold">
                {organizationData?.organizationName || "Organization Name"}
              </h2>
              <p className="text-gray-600 text-justify">
                {organizationData?.organizationDescription || "No description available."}
              </p>
            </div>
            
            <div className="text-black pending-tasks bg-orange-400 col-span-2 p-4 rounded shadow">
              <TaskList />
            </div>
            <Link href="/officertaskspage"><p
            className=" mx-100 my-1 text-right hover:text-purple-700"
            style={{ fontSize: "16px", fontFamily: "Arial" }}
          >
            {" "}
            View More
          </p></Link>
          </div>

          <div className="text-black relative flex flex-col gap-4 w-full justify-end">
            <div className="text-black calendar h-64 w-full max-w-xs bg-gray-200 self-end">
              Calendar
            </div>
            <div className="text-black memberstats h-20 w-full max-w-xs bg-gray-300 p-4 self-end flex items-center justify-center">
              <span className="text-lg font-semibold">
               {approvedMemberCount} total members
              </span>
            </div>
            <div className="text-black eventstats h-20 w-full max-w-xs bg-gray-300 p-4 self-end">
              <span className="text-lg font-semibold">
                {completedEventCount} events this year
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficerDashboard;
function setCompletedEventCount(size: number) {
  throw new Error("Function not implemented.");
}


