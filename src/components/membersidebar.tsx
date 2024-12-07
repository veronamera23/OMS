import React, { useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import { auth, db } from "../firebaseConfig"; // Import your firebase config
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

const OfficerSidebar: React.FC = () => {
  const [userOrganizations, setUserOrganizations] = useState<any[]>([]); // Store list of organizations
  const [loading, setLoading] = useState(true); // Loading state for user organizations

  // Function to fetch organizations for the logged-in user
  const fetchUserOrganizations = async (userId: string) => {
    try {
      // Query the 'Members' collection to find the user's approved organizations
      const membersRef = collection(db, "Members");
      const q = query(
        membersRef,
        where("uid", "==", userId),
        where("status", "==", "approved")
      );
      const querySnapshot = await getDocs(q);

      const orgs = [];
      for (const docSnapshot of querySnapshot.docs) {
        const memberData = docSnapshot.data();
        const orgId = memberData.organizationId;

        // Fetch organization details using the organizationId from the 'Organizations' collection
        const orgDocRef = doc(db, "Organizations", orgId);
        const orgDoc = await getDoc(orgDocRef);
        const orgData = orgDoc.data();

        if (orgData) {
          orgs.push(orgData); // Add the organization data to the list
        }
      }

      setUserOrganizations(orgs); // Set the organizations to state
    } catch (error) {
      console.error("Error fetching user organizations:", error);
    } finally {
      setLoading(false); // Set loading state to false once fetching is complete
    }
  };

  useEffect(() => {
    // Start by setting loading state to true when component mounts
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserOrganizations(user.uid); // Fetch organizations once user is logged in
      } else {
        setUserOrganizations([]); // If no user is logged in, reset organizations
        setLoading(false); // Set loading state to false if no user is logged in
      }
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs only on mount

  return (
    <aside className="w-64 h-auto bg-gray-100 shadow-lg flex flex-col">
      {/* Sidebar Title with Logo */}
      <div className="p-6 bg-gray-100 flex justify-center items-center">
        <Link href="/memberpage">
          <img src="/assets/OMSLOGO.png" alt="OMS Logo" className="h-12 mt-4" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow mt-4">
        {/* Loop through user organizations and render them */}
        {userOrganizations.map((org, index) => (
          <a
            key={index}
            href="/membervieworg"
            className="flex items-center px-6 py-3 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
          >
            {/* <img src={org.logo || "/assets/default-logo.png"} alt={org.name} className="h-6" /> */}
              <span className="ml-3 text-md font-medium">{org.name}</span>
          </a>
        ))}

        <hr className="my-4 border-gray-300" />

        <a
          href="#"
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
        >
          <InfoIcon />
          <span className="ml-3 text-md font-medium">Information</span>
        </a>

        <a
          href="#"
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
        >
          <SettingsIcon />
          <span className="ml-3 text-md font-medium">Profile Settings</span>
        </a>
      </nav>

      {/* Footer */}
      <div className="p-4 text-sm text-gray-500 border-t border-gray-300">
        © 2024 OMS Platform
      </div>
    </aside>
  );
};

export default OfficerSidebar;
