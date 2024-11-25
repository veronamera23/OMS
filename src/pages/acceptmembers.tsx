import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import FinalMembers from "../components/finalmembers";

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
    <div className="accept-members-container p-4">
      <h1 className="text-2xl font-semibold mb-4">Pending Member Requests</h1>
      {members.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {members.map((member) => (
            <li key={member.id} className="p-2 bg-gray-100 rounded flex justify-between items-center">
              <div>
                <p>
                  <strong>Name:</strong> {member.fullName || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Joined At:</strong> {member.joinedAt}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-white bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handleApproval(member.id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleApproval(member.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending member requests.</p>
      )}
            {/* Button to toggle approved members */}
            <div className="mt-6">
        <button
          className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowApprovedMembers((prev) => !prev)}
        >
          {showApprovedMembers ? "Hide Approved Members" : "Show Approved Members"}
        </button>
      </div>

      {/* Render FinalMembers component */}
      {showApprovedMembers && <FinalMembers />}
    </div>
    
  );
};

export default AcceptMembers;
