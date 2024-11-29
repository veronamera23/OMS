import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import FinalMembers from "../components/finalmembers";
import OfficerSidebar from "../components/officersidebar"; 

const AcceptMembers: React.FC = () => {
  const [members, setMembers] = useState<
    Array<{ id: string; uid: string; fullName: string; joinedAt: string; status: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [showApprovedMembers, setShowApprovedMembers] = useState(false); // State to toggle FinalMembers

  // Fetch pending members for the logged-in organization's ID
  const fetchPendingMembers = async () => {
    try {
      if (!user) {
        alert("You must be logged in to view this page.");
        return;
      }

      const usersRef = collection(db, "Users");
      const userQuery = query(usersRef, where("email", "==", user.email));
      const userDocs = await getDocs(userQuery);

      if (userDocs.empty) {
        alert("You are not authorized to access this page.");
        return;
      }

      const userData = userDocs.docs[0]?.data();
      if (userData.role !== "organization") {
        alert("You are not authorized to access this page.");
        return;
      }

      const organizationId = userData.organizationId;

      // Fetch pending member requests
      const membersRef = collection(db, "Members");
      const pendingQuery = query(
        membersRef,
        where("organizationId", "==", organizationId),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(pendingQuery);

      // Map member details to display
      const memberPromises = querySnapshot.docs.map(async (memberDoc) => {
        const memberData = memberDoc.data();
        const memberId = memberData.uid;

        // Fetch member's fullName from the `Users` collection
        const userDoc = await getDoc(doc(db, "Users", memberId));
        const fullName = userDoc.exists() ? userDoc.data().fullName || "Unknown" : "Unknown";

        return {
          id: memberDoc.id,
          uid: memberId,
          fullName,
          joinedAt: memberData.joinedAt || "N/A",
          status: memberData.status || "pending",
        };
      });

      const resolvedMembers = await Promise.all(memberPromises);
      setMembers(resolvedMembers);
    } catch (error) {
      console.error("Error fetching pending members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingMembers();
  }, [user]);

  const handleApproval = async (memberId: string, newStatus: "approved" | "rejected") => {
    try {
      const memberDocRef = doc(db, "Members", memberId);
      await updateDoc(memberDocRef, { status: newStatus });

      // Update the UI
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== memberId)
      );

      alert(`Member has been ${newStatus}.`);
    } catch (error) {
      console.error(`Error updating member status:`, error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <OfficerSidebar />

      {/* Main Content */}
      <div className="flex flex-col bg-[#F3E8FF] min-h-screen w-full">
        {/* Header */}
        <header className="bg-purple-600 p-4 text-white">
          <h1 className="text-3xl font-bold">Manage Member Requests</h1>
        </header>

        <main className="p-6 flex flex-col gap-6">
          {/* Pending Members Section */}
          <section className="bg-white shadow rounded p-6">
            <h2 className="text-2xl font-semibold text-purple-700">Pending Members</h2>
            {members.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="p-4 bg-purple-100 shadow rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="text-black">
                        <strong>Name:</strong> {member.fullName || "N/A"}
                      </p>
                      <p className="text-black">
                        <strong>Joined At:</strong> {member.joinedAt}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                        onClick={() => handleApproval(member.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-purple-300 text-white px-4 py-2 rounded hover:bg-purple-400"
                        onClick={() => handleApproval(member.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black mt-4">No pending member requests.</p>
            )}
          </section>
          
        </main>
      </div>
    </div>
  );
};

export default AcceptMembers;
