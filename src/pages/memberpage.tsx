import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const MemberPage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        const userData = userDoc.data();

        if (userData?.role !== "member") {
          router.push("/"); // Redirect non-member users to home
        } else {
          setLoading(false); // Allow access for members
        }
      } else {
        router.push("/login"); // Redirect unauthenticated users to login
      }
    };

    checkUserRole();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Member Dashboard</h1>
      <p>Welcome, Christine! Here is your dashboard.</p>
      {/* Add member-specific content here */}
    </div>
  );
}; 

export default MemberPage;
