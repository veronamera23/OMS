import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import OfficerLanding from "../components/officerlanding";

const OrgPage = () => {
  const [loading, setLoading] = useState(true);
  const [isOrganizationMember, setIsOrganizationMember] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        const userData = userDoc.data();

        if (userData?.role !== "organization") {
          router.push("/"); // Redirect non-organization users to home
        } else {
            setIsOrganizationMember(true);
          setLoading(false); // Allow access for organization users
        }
      } else {
        router.push("/login"); // Redirect unauthenticated users to login
      }
    };

    checkUserRole();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  // Render OfficerDashboard if the user is an organization member
  return isOrganizationMember ? <OfficerLanding /> : null;
};

export default OrgPage;
