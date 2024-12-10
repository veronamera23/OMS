import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import OfficerSidebar from "../components/officersidebar";

const ViewOfficersOfficerView: React.FC = () => {
  const [officers, setOfficers] = useState<{
    [key: string]: { name: string; course: string; yearLevel: string };
  }>({});
  const [loading, setLoading] = useState(true);

  const fetchOfficers = async () => {
    try {
      const organizationId = localStorage.getItem("organizationId") || "";
      const officersRef = collection(db, "Users");
      const q = query(
        officersRef,
        where("organizationId", "==", organizationId),
        where("role", "==", "officer")
      );
      const querySnapshot = await getDocs(q);

      const officersData: {
        [key: string]: { name: string; course: string; yearLevel: string };
      } = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        officersData[data.position] = {
          name: data.fullName,
          course: data.course || "Unknown Course", 
          yearLevel: data.yearLevel || "Unknown Year", 
        };
      });

      setOfficers(officersData);
    } catch (error) {
      console.error("Error fetching officers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  if (loading) return <div>Loading...</div>;

  const generateRandomGradient = () => {
    const gradients = [
      // Blue first
      `linear-gradient(to top, #60A5FA, #8B5CF6)`,
      `linear-gradient(to top right, #60A5FA, #4F46E5)`,
      `linear-gradient(to right, #60A5FA, #6D28D9)`,
      `linear-gradient(to bottom right, #60A5FA, #4338CA)`,
      `linear-gradient(to bottom, #60A5FA, #7C3AED)`,
      `linear-gradient(to bottom left, #60A5FA, #3730A3)`,
      `linear-gradient(to left, #818CF8, #8B5CF6)`,
      `linear-gradient(to top left, #818CF8, #4F46E5)`,

      // Purple first
      `linear-gradient(to top, #8B5CF6, #60A5FA)`,
      `linear-gradient(to top right, #4F46E5, #60A5FA)`,
      `linear-gradient(to right, #6D28D9, #60A5FA)`,
      `linear-gradient(to bottom right, #4338CA, #60A5FA)`,
      `linear-gradient(to bottom, #7C3AED, #60A5FA)`,
      `linear-gradient(to bottom left, #3730A3, #60A5FA)`,
      `linear-gradient(to left, #8B5CF6, #818CF8)`,
      `linear-gradient(to top left, #4F46E5, #818CF8)`,
    ];

    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  };

  return (
    <div className="flex">
      <OfficerSidebar />
      <main className="main-content flex-grow p-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-purple-500">
            View Officers of
          </h1>
          <hr className="border-t-2 border-purple-500 mb-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(officers).map(([position, { name, course, yearLevel }]) => (
            <div
              key={position}
              className={`p-4 rounded shadow transition-all duration-300 ease-linear hover:scale-105 group`}
              style={{ background: generateRandomGradient() }}
            >
              <div className="officer-card relative overflow-hidden h-fit">
                <div className="mt-2 text-center">
                  <h2 className="text-lg font-semibold text-white">{name}</h2>
                  <p className="text-gray-200">{position}</p>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-black/50 text-gray-200 text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {course} - {yearLevel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ViewOfficersOfficerView;