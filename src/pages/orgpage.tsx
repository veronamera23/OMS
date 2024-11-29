import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import OfficerLanding from "../components/officerlanding";
import { onAuthStateChanged } from "firebase/auth";

const OrgPage = () => {
  const [loading, setLoading] = useState(true);
  const [isOrganizationMember, setIsOrganizationMember] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          const userData = userDoc.data();

          if (userData?.role === "organization") {
            setIsOrganizationMember(true); // User is authorized
          } else {
            router.push("/"); // Redirect non-organization users to home
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          router.push("/"); // Redirect in case of error
        }
      } else {
        router.push("/login"); // Redirect unauthenticated users to login
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  if (loading) return <div>Loading...</div>;

  // Render OfficerDashboard if the user is an organization member
  return isOrganizationMember ? <OfficerLanding /> : null;
};

export default OrgPage;
