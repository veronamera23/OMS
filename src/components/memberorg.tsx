import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import MemberSidebar from "./membersidebar";
import MemTaskList from "./memtasklist";
import OrgEventList from "./orgeventlist";
import Calendar from "./calendar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

const MemberOrg: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();

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
        <div className="py-2">
          <Link
            href="/memberpage"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowBackIcon />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        <div className="welcome-message ml-auto">
          <b>Welcome back, {firstName || "User"}! {/* Display first name */}</b>
        </div>
        <p style={{ fontSize: "16px", fontFamily: "Arial" }}>
          {" "}
          Check out what's happening at "Organization Name"
        </p>
        <hr className="my-4 border-black" />
        <OrgEventList />
        <p
          className="my-2 text-right hover:text-purple-700"
          style={{ fontSize: "16px", fontFamily: "Arial" }}
        >
          {" "}
          View More
        </p>
        <p className="pt-10" style={{ fontSize: "16px", fontFamily: "Arial" }}>
          {" "}
          What else would you like to do?
        </p>
        <div className="flex py-4 gap-4 w-min">
          <Link href="/memberviewevents">
            <button className="officer-action-buttons flex-grow">
              View My Events
            </button>
          </Link>
          <button
            className="officer-action-buttons flex-grow"
            onClick={handleOrgListRedirect}
          >
            View Members
          </button>
        </div>
      </div>
      <div className="lg:col-start-3 mt-8 ml-6">
        <button
          className="logout-button text-sm px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 absolute right-[1.5rem] top-[2rem]"
          onClick={handleLogout}
        >
          Log Out
        </button>
        <div
          className="mt-16 rounded-lg shadow-lg h-auto bg-gray-100"
          style={{ width: "90%", height: "55%" }}
        >
          <div className="mx-3 pt-7 h-auto max-w-lg">
            <Calendar />
          </div>
        </div>
        <div className="mt-4 text-black mb-8 mx-28 justify-center text-center flex h-4 w-full max-w-xs">
          <p
            className="flex mr-6"
            style={{ fontSize: "22px", fontFamily: "Arial" }}
          >
            {currDate}
          </p>
          <p style={{ fontSize: "22px", fontFamily: "Arial" }}>{currTime}</p>
        </div>
        <div
          className=" text-black h-45 rounded-lg shadow-lg"
          style={{ width: "90%" }}
        >
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
    </div>
  );
};

export default MemberOrg;
