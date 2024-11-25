import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import MemberDashboard from "../components/memberdashboard"; // Make sure the path is correct

const MemberPage = () => {
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        const userData = userDoc.data();

        if (userData?.role !== "member") {
          router.push("/"); // Redirect non-organization users to home
        } else {
            setIsMember(true);
          setLoading(false); // Allow access for organization users
        }
      } else {
        router.push("/login"); // Redirect unauthenticated users to login
      }
    };

    checkUserRole();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  // Render Memberboard if the user is an member
  return isMember ? <MemberDashboard /> : null;
};

export default MemberPage;


