import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState, FormEvent } from "react";
import { auth, db } from "../firebaseConfig";
import { setDoc, doc, where, collection, query, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function RegisterOrg() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [oname, setOname] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]); // State to track selected tags
  const [otherTag, setOtherTag] = useState<string>(""); // State to track custom tag input
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>(""); // State to track the currently selected tag

  // Function to validate input fields
  const validateInputs = (): boolean => {
    if (oname.trim().length < 3) {
      setErrorMessage("Organization name must be at least 3 characters.");
      setTimeout(() => setErrorMessage(null), 3000);
      return false;
    }
    if (description.trim().length < 10) {
      setErrorMessage("Organization description must be at least 10 characters.");
      setTimeout(() => setErrorMessage(null), 3000);
      return false;
    }
    if (!email.includes("@")) {
      setErrorMessage("Enter a valid email address.");
      setTimeout(() => setErrorMessage(null), 3000);
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setTimeout(() => setErrorMessage(null), 3000);
      return false;
    }
    return true;
  };

  // Function to check if the organization name is unique
  const isOrganizationNameUnique = async (oname: string): Promise<boolean> => {
    const orgQuery = query(collection(db, "Organizations"), where("name", "==", oname));
    const snapshot = await getDocs(orgQuery);
    return snapshot.empty;
  };

  // Function to handle the registration process
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!validateInputs()) return; // If validation fails, stop further execution
  
    setLoading(true); // Set loading state to true while processing
    try {
      // Check if the organization name is unique
      if (!(await isOrganizationNameUnique(oname))) {
        setErrorMessage("Organization name already exists. Please choose another.");
        setTimeout(() => setErrorMessage(null), 3000);
        setLoading(false);
        return;
      }
  
      // Create a new user with the provided email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get user object from returned credential
  
      if (user) {
        // Generate a unique organizationId
        const organizationId = uuidv4();
  
        // Save the organization data in the Organizations collection
        await setDoc(doc(db, "Organizations", organizationId), {
          name: oname,
          email: user.email,
          photo: "",
          description: description,
          members: [user.uid],
          createdAt: new Date(),
          tags: tags, // Store the selected tags
        });
  
        // Save the user data in the Users collection
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          organizationId: organizationId,
          role: "organization",
        });
  
        setSuccessMessage("User Registered Successfully! Redirecting...");
        setTimeout(() => (window.location.href = "/login"), 3000);
      }
  
    } catch (error) {
      const errorMessage = (error as Error).message || "An unexpected error occurred.";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to handle tag selection
  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedTag(value); // Set selected tag

    if (value === "other" && otherTag.trim() !== "") {
      setTags(prevTags => [...prevTags, otherTag]); // Add custom tag to tags
    } else if (value !== "other" && !tags.includes(value)) {
      setTags(prevTags => [...prevTags, value]); // Add selected tag to tags
    }
  };

  // Function to handle input change for custom tags
  const handleOtherTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherTag(e.target.value); // Update the custom tag input value
  };

  return (
    <div className="bg-gradient-to-bl from-cyan-400 to-fuchsia-600 min-h-screen flex items-center justify-center">
      <div className="flex flex-col md:flex-row-reverse w-[65%] max-w-6xl bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Right Side - OMS Welcome Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-bl from-cyan-200 to-fuchsia-500 text-white p-8 flex flex-col justify-center items-center">
          <img src="/assets/OMSLOGO.png" alt="OMS Logo" className="h-28 mb-6" />
          <h1 className="text-3xl font-extrabold mb-4 text-center">Welcome to OMS</h1>
          <p className="text-lg text-center mb-6">
            Register your organization and start managing it efficiently with us.
          </p>
          <p className="text-center mt-8 text-sm">www.organizationmanagementsystem.com</p>
        </div>

        {/* Left Side - Registration Form */}
        <div className="w-full md:w-1/2 p-8">
          <h3 className="text-2xl font-bold text-center mb-6">Register Organization</h3>

          {/* Displaying error or success messages */}
          {errorMessage && (
            <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-500 text-white p-3 rounded-md mb-4 text-center">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-2">
            <div>
              <label htmlFor="oname" className="block text-gray-600 font-medium mb-1">
                Organization Name
              </label>
              <input
                type="text"
                id="oname"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter organization name"
                onChange={(e) => setOname(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-600 font-medium mb-1">
                Organization Description
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter a short description of your organization"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-gray-600 font-medium mb-1">
                Select Organization Tags
              </label>
              <select
                id="tags"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleTagChange}
                value={selectedTag} // Bind selectedTag state to dropdown
              >
                <option value="">Select a tag</option>
                <option value="sports">Sports</option>
                <option value="academic">Academic</option>
                <option value="interest">Interest</option>
                <option value="other">Other (Specify)</option>
              </select>
              {selectedTag === "other" && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter your custom tag"
                    value={otherTag}
                    onChange={handleOtherTagChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-600 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-600 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md mt-4 hover:bg-blue-700 focus:outline-none"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 font-bold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterOrg;
