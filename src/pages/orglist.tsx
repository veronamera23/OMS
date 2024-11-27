import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const OrgList: React.FC = () => {
  const [organizations, setOrganizations] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch organizations
  const fetchOrganizations = async () => {
    try {
      const usersRef = collection(db, "Users");
      const orgQuery = query(usersRef, where("role", "==", "organization"));
      const querySnapshot = await getDocs(orgQuery);

      const organizationPromises = querySnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const orgId = userData.organizationId;

        if (orgId) {
          const orgDoc = await getDoc(doc(db, "Organizations", orgId));
          if (orgDoc.exists()) {
            return { id: orgId, name: orgDoc.data().name || "Unnamed Organization" };
          }
        }
        return null;
      });

      const resolvedOrganizations = (await Promise.all(organizationPromises)).filter(Boolean);
      setOrganizations(resolvedOrganizations as Array<{ id: string; name: string }>);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle joining an organization
  const handleJoinOrganization = async (organizationId: string) => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      alert("You must be logged in to join an organization.");
      return;
    }

    try {
      // Check if the user is already part of the organization (pending, accepted, or rejected)
      const membersRef = collection(db, "members");
      const memberQuery = query(membersRef, where("uid", "==", userId), where("organizationId", "==", organizationId));
      const memberSnapshot = await getDocs(memberQuery);

      if (!memberSnapshot.empty) {
        alert("You have already requested to join or are already a member of this organization.");
        return;
      }

      // Add the user to the Members collection with "pending" status
      await setDoc(doc(db, "Members", `${userId}_${organizationId}`), {
        uid: userId,
        organizationId: organizationId,
        status: "pending",  // The request is pending approval
        joinedAt: new Date().toISOString(),
        approvalDate: null,  // No approval date yet
      });

      alert("Request to join the organization has been sent for approval.");
    } catch (error) {
      console.error("Error joining organization:", error);
      alert("There was an error while sending your request.");
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="orglist-container p-4">
      <h1 className="text-2xl font-semibold mb-4">Organization List</h1>
      {/* <button
        className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => (window.location.href = "/memberdashboard")}
      >
        Back to Dashboard
      </button> */}
      <ul className="mt-4 space-y-2">
        {organizations.length > 0 ? (
          organizations.map((org) => (
            <li key={org.id} className="p-2 bg-gray-100 rounded flex justify-between items-center">
              <span>{org.name}</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleJoinOrganization(org.id)}
              >
                Join Organization
              </button>
            </li>
          ))
        ) : (
          <li>No organizations found.</li>
        )}
      </ul>
    </div>
  );
};

export default OrgList;
