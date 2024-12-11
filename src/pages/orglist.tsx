import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import MemberSidebar from "../components/membersidebar";
import SearchIcon from "@mui/icons-material/Search";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";


const Header: React.FC = () => {
  // const handleRedirect = () => {
  //   window.location.href = "/acceptmembers";
  // };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200">
      <div>
        <Link href="/memberpage" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
          <ArrowBackIcon />
          <span>Back to Dashboard</span>
        </Link>
      </div>
      {/* <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <button
          className="text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-200"
          onClick={handleRedirect}
        >
          Pending Requests
        </button>
      </div> */}
    </div>
  );
};

const SearchAndFilter: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="relative flex items-center bg-white p-4 rounded-md mt-6 shadow-lg border border-gray-300 justify-center">
      <div className="relative flex-grow">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 text-gray-600 placeholder-gray-400 bg-white rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Search..."
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <SearchIcon className="h-5 w-5" />
        </span>
      </div>
      <div className="ml-4 flex items-center space-x-4">
        <span className="text-gray-600 text-sm">Filter by:</span>
        {["Active", "Joined"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${
              activeFilter === filter
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </button>
        ))}
        <Menu as="div" className={`relative inline-block text-left`}>
          <div>
            <MenuButton className={`inline-flex px-4 py-2 border rounded-md text-sm font-medium`}>
              Category 
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                <button
                  className="flex px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Category 1
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  className="flex px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Category 2
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  className="flex px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Category 3
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>

        <Menu as="div" className={`relative inline-block text-left`}>
          <div>
            <MenuButton className={`inline-flex px-4 py-2 border rounded-md text-sm font-medium`}>
              Application
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                <button
                  className="flex px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Accepted
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  className="flex px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Ongoing
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  className="flex px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Rejected
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

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
    <div className="flex">
      <MemberSidebar />
      <div className="flex-grow p-6 bg-white">
          <Header />
          <SearchAndFilter />
          {/* To add another org copy here */}
          <div className="grid lg:grid-cols-2 p-1 mt-2 m-auto text-black h-32 w-full transition-shadow duration-200 hover:shadow-lg hover:shadow-gray-300" style={{gridTemplateColumns: "80% 20%"}}>
            <div className="lg:col-start-1">
              <div
                  className="p-2 flex flex-col lg:flex-row"
                  style={{
                    display: 'flex',
                    transition: 'box-shadow 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    className="mb-4 w-60 h-20 rounded bg-gray-200"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '8px',
                      backgroundColor: '#E5E7EB',
                    }}
                  >
                    <img
                      src="/assets/komsai.png"
                      className="w-full h-full object-cover rounded"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                  <div
                    className="ml-8 mt-2 flex flex-col"
                    style={{
                      marginLeft: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '20px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}
                    >
                      Org Name
                    </p>
                    <p
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        lineHeight: '0.5',
                        color: '#4B5563',
                      }}
                    >
                      Org Description
                    </p>
                    </div>
                  </div>
                  
                </div>
                <div className="lg:col-start-2 justify-center text-center w-full pt-10 pr-5">
                    <button className="bg-purple-600 text-white p-2 w-56 rounded-lg hover:bg-purple-700 ">
                          <p
                              className="mx-1 w-auto"
                              style={{
                                fontSize: '20px',
                                fontFamily: 'Inter',
                              }}
                            >
                              Join Organization
                            </p>
                        </button>
                  </div>
            </div>
            
            {/* Copy until here */}
          </div>
          


          {/*<div className="orglist-container p-4">
            <h1 className="text-2xl font-semibold mb-4">Organization List</h1>
            // <button
            // className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            // onClick={() => (window.location.href = "/memberdashboard")}
            // >
            // Back to Dashboard
            // </button>
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
          </div> */}
    </div>
    
  );
};

export default OrgList;
