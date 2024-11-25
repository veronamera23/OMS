import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const MemberDashboard: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user's first name from the 'members' collection
  const fetchUserData = async (userId: string) => {
    try {
      // Fetch the user's data from the 'Users' collection
      const userDoc = await getDoc(doc(db, "Users", userId));
      const userData = userDoc.data();

      // Ensure the user exists and has a memberId
      if (userData?.memberId) {
        // Fetch the user details from the 'members' collection using memberId
        const memberDoc = await getDoc(doc(db, "members", userData.memberId));
        const memberData = memberDoc.data();

        if (memberData) {
          // Set the first name from the 'members' collection
          setFirstName(memberData.firstName);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);
        fetchUserData(user.uid); // Fetch user data when the user logs in
      } else {
        setLoading(false); // Handle user being logged out
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // Display loading state while fetching data

  const handleOrgListRedirect = () => {
    window.location.href = "/orglist"; // Redirect to orglist.tsx
  };

  return (
    <div className="dashboard-container">
      {/* Main content */}
      <main className="main-content">
        {/* Header with "Welcome" at the top-left */}
        <header className="header flex justify-start items-center">
          <h1 className="header-title"> Member Dashboard</h1>
          <div className="welcome-message ml-auto">
            Welcome back, {firstName || "User"}! {/* Display first name */}
          </div>
        </header>
        <button
          className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleOrgListRedirect}
        >
          Organization List
        </button>

        {/* Other sections of the dashboard */}
        <div className="dashboard-content">
          {/* Add other content here */}
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
