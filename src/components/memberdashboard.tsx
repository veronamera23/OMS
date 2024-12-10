import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import MemberSidebar from "./membersidebar";
import Link from 'next/link';
import MemTaskList from "./memtasklist"
import MemberEventList from "./membereventlist";
import Calendar from "./calendar";

const MemberDashboard: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
      <div
        className="grid lg:grid-cols-3 bg-white"
        style={{ gridTemplateColumns: "20% 40% 40%" }}
      >
        <div className="flex lg:col-start-1">
          <MemberSidebar />
        </div>
        <div className="lg:col-start-2 mt-8">
          <div className="welcome-message ml-auto">
            Welcome back, {firstName || "User"}! {/* Display first name */}
          </div>
          <p style={{ fontSize: "16px", fontFamily: "Arial" }}>
            {" "}
            How are we doing today?
          </p>
          <hr className="my-4 border-black" />
          <div className="ml-6" style={{width: '90%'}}>
            <Calendar />
          </div>
          <div className="mx-32 my-5 text-black memberstats h-4 w-full max-w-xs bg-gray-300 p-4">
            Current Date and Time
          </div>
          <div
          className="mx-1 text-black pending-tasks bg-white h-34 w-[600px] p-5 flex justify-start">
          <MemTaskList />
        </div>
          <p
            className="mx-16 my-2 text-right hover:text-purple-700"
            style={{ fontSize: "16px", fontFamily: "Arial" }}
          >
            {" "}
            View More
          </p>
        </div>
        <div className="lg:col-start-3 mt-8 ml-6">
          <button className="logout-button text-sm px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 absolute right-[1.5rem] top-[2rem]"
          onClick={handleLogout} >
            Log Out
          </button>
          <p className="pt-10" style={{ fontSize: "16px", fontFamily: "Arial" }}>
            {" "}
            What else would you like to do?
          </p>
          <div className="flex py-4 gap-4 w-min">
            <button 
              className="officer-action-buttons flex-grow"
              onClick={handleOrgListRedirect}>
              View Orgs
            </button>
            <Link href="/memberviewevents" >
            <button className="officer-action-buttons flex-grow">
              View All Events
            </button>
            </Link>
          </div>
          <p
            className="pt-2 pb-2"
            style={{ fontSize: "16px", fontFamily: "Arial" }}
          >
            {" "}
            Check out what's happening...
          </p>
          <div style={{width: '90%'}}>
            <MemberEventList/>
          </div>
          <Link href="/memberviewevents" ><p
            className="mx-16 my-1 text-right hover:text-purple-700"
            style={{ fontSize: "16px", fontFamily: "Arial" }}
          >
            {" "}
            View More
          </p></Link>
        </div>
      </div>
  );
};

export default MemberDashboard;
